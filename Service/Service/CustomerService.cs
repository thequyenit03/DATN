using Microsoft.IdentityModel.Tokens;
using Service.Dto;
using Service.Model;
using Service.Util;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Service.Service
{
    public class CustomerService(MyContext context) : IServiceBase<CustomerDto, string>
    {
        protected MyContext context = context;

        /// <summary>
        /// Gửi yêu cầu OTP vào email khi đăng ký tài khoản
        /// </summary>
        /// <param name="email"></param>
        public void RequestOTP(string email)
        {
            if (context.Customers.Any(x => x.Email == email))
                throw new ArgumentException("Email đã được sử dụng");
            var emailSignUp = context.EmailSignUps.FirstOrDefault(x => x.Email == email);

            string otp = new Random().Next(100000, 999999).ToString();
            if (emailSignUp == null)
            {
                emailSignUp = new EmailSignUp()
                {
                    Email = email,
                    OTP = otp
                };
                context.EmailSignUps.Add(emailSignUp);
            }
            else
            {
                emailSignUp.OTP = otp;
            }
            EmailConfiguration emailConfiguration = context.EmailConfigurations.First();
            EmailTemplate emailTemplate = context.EmailTemplates.First(x => x.Id == 6);

            string bodyMail = emailTemplate.Content.Replace(Constants.EmailKeyGuide.OTP, otp);
            DataHelper.SendMail(emailConfiguration, emailTemplate.Subject!, bodyMail,
            [
                email
            ], emailTemplate.CC?.Split(';').ToList(), emailTemplate.BCC?.Split(';').ToList());
            context.SaveChanges();
        }

        /// <summary>
        /// Xác thực mã OTP khi đăng ký tài khoản
        /// </summary>
        /// <param name="email"></param>
        /// <param name="otp"></param>
        /// <returns></returns>
        public bool ConfirmOTP(string email, string otp)
        {
            return context.EmailSignUps.Any(x => x.Email == email && x.OTP == otp);
        }

        /// <summary>
        /// Gửi yêu cầu cấp lại mật khẩu
        /// </summary>
        /// <param name="email"></param>
        public void ForgotPassword(string email)
        {
            if (!context.Customers.Any(x => x.Email == email))
                throw new ArgumentException("Email chưa được đăng ký sử dụng");
            Customer customer = context.Customers.First(x => x.Email == email);

            string newPassword = Guid.NewGuid().ToString("N")[..6].ToUpper();

            customer.Password = DataHelper.SHA256Hash(customer.Email + "_" + newPassword);

            EmailConfiguration emailConfiguration = context.EmailConfigurations.First();
            EmailTemplate emailTemplate = context.EmailTemplates.First(x => x.Id == 5);

            string bodyMail = emailTemplate.Content.Replace(Constants.EmailKeyGuide.NewPassword, newPassword);
            DataHelper.SendMail(emailConfiguration, emailTemplate.Subject!, bodyMail,
            [
                email
            ], emailTemplate.CC?.Split(';').ToList(), emailTemplate.BCC?.Split(';').ToList());
            context.SaveChanges();
        }

        /// <summary>
        /// Đăng nhập
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public object GetAccessToken(CustomerDto entity)
        {
            Customer customer = context.Customers
                .First(x => x.Email == entity.Email) ?? throw new ArgumentException("Tài khoản hoặc mật khẩu không đúng");
            string passwordCheck = DataHelper.SHA256Hash(entity.Email + "_" + entity.Password);

            if (customer.Password != passwordCheck)
                throw new ArgumentException("Tài khoản hoặc mật khẩu không đúng");

            customer.LastLogin = DateTime.Now;
            context.SaveChanges();

            DateTime expirationDate = DateTime.Now.Date.AddMinutes(Constants.JwtConfig.ExpirationInMinutes);
            long expiresAt = (long)(expirationDate - new DateTime(1970, 1, 1)).TotalSeconds;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Constants.JwtConfig.SecretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                [
                        new Claim(ClaimTypes.UserData, customer.Code),
                        new Claim(ClaimTypes.Expiration, expiresAt.ToString())
                ]),
                Expires = expirationDate,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new
            {
                customer.Email,
                customer.FullName,
                Token = tokenHandler.WriteToken(token),
                ExpiresAt = expiresAt
            };
        }

        /// <summary>
        /// Lấy danh sách đơn hàng của khách hàng
        /// </summary>
        /// <param name="customerCode"></param>
        /// <returns></returns>
        public List<OrderDto> GetOrders(string customerCode)
        {
            return context.Orders
                .Where(x => x.CustomerCode == customerCode)
                .OrderByDescending(x => x.Created)
                .Select(x => new OrderDto()
                {
                    Id = x.Id,
                    Address = x.Address,
                    CustomerCode = x.CustomerCode,
                    PhoneNumber = x.PhoneNumber,
                    Status = x.Status,
                    TotalAmount = x.TotalAmount,
                    OrderDetails = x.OrderDetails!.Select(y => new OrderDetailDto()
                    {
                        Id = y.Id,
                        OrderId = y.OrderId,
                        ProductDiscountPrice = y.ProductDiscountPrice,
                        ProductImage = y.ProductImage,
                        ProductName = y.ProductName,
                        ProductPrice = y.ProductPrice,
                        Qty = y.Qty,
                        Attribute = y.Attribute,
                        Reviews = y.Reviews!.Select(z => new ReviewDto()
                        {
                            Content = z.Content,
                            Star = z.Star,
                            CreatedBy = z.CreatedBy,
                            Status = z.Status,
                            Created = z.Created
                        }).ToList()
                    }).ToList(),
                    Created = x.Created
                })
                .ToList();
        }

        public virtual void DeleteById(string key)
        {
            throw new NotImplementedException();
        }



        public virtual List<CustomerDto> GetAll()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Get thông tin khách hàng theo id
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public virtual CustomerDto GetById(string key)
        {
            return context.Customers
                  .Where(x => x.Code == key)
                  .Select(x => new CustomerDto()
                  {
                      Code = x.Code,
                      Address = x.Address,
                      Avatar = x.Avatar,
                      Dob = x.Dob,
                      Email = x.Email,
                      FullName = x.FullName,
                      Gender = x.Gender,
                      PhoneNumber = x.PhoneNumber,
                      Orders = x.Orders!.OrderByDescending(y => y.Created).Select(y => new OrderDto()
                      {
                          Id = y.Id,
                          Address = y.Address,
                          Created = y.Created,
                          Note = y.Note,
                          PhoneNumber = y.PhoneNumber,
                          Status = y.Status,
                          TotalAmount = y.TotalAmount,
                          OrderDetails = y.OrderDetails!.Select(z => new OrderDetailDto()
                          {
                              Attribute = z.Attribute,
                              ProductDiscountPrice = z.ProductDiscountPrice,
                              ProductImage = z.ProductImage,
                              ProductName = z.ProductName,
                              ProductPrice = z.ProductPrice,
                              Qty = z.Qty
                          }).ToList()
                      }).ToList()
                  })
                  .First();
        }

        /// <summary>
        /// Thêm mới tài khoản khách hàng
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public virtual CustomerDto Insert(CustomerDto entity)
        {
            if (!context.EmailSignUps.Any(x => x.Email == entity.Email && x.OTP == entity.OTP))
                throw new ArgumentException("Thông tin xác thực OTP không hợp lệ");

            if (context.Customers.Any(x => x.Email == entity.Email))
                throw new ArgumentException("Email đã được đăng ký");

            if (context.Customers.Any(x => x.PhoneNumber == entity.PhoneNumber))
                throw new ArgumentException("Số điện thoại đã được đăng ký");

            Customer customer = new()
            {
                Code = Guid.NewGuid().ToString("N"),
                FullName = entity.FullName!,
                PhoneNumber = entity.PhoneNumber,
                Email = entity.Email,
                Password = DataHelper.SHA256Hash(entity.Email + "_" + entity.Password)
            };

            context.Customers.Add(customer);
            context.SaveChanges();

            return entity;
        }

        /// <summary>
        /// Cập nhật thông tin khách hàng
        /// </summary>
        /// <param name="key"></param>
        /// <param name="entity"></param>
        public virtual void Update(string key, CustomerDto entity)
        {
            Customer customer = context.Customers
                .First(x => x.Code == key);

            if (customer != null)
            {
                if (context.Customers.Any(x => x.Code != entity.Code && x.Email == entity.Email))
                    throw new ArgumentException("Email đã được đăng ký");

                if (context.Customers.Any(x => x.Code != entity.Code && x.PhoneNumber == entity.PhoneNumber))
                    throw new ArgumentException("Số điện thoại đã được đăng ký");

                customer.FullName = entity.FullName!;
                customer.Email = entity.Email;
                customer.PhoneNumber = entity.PhoneNumber;
                customer.Address = entity.Address;
                customer.Dob = entity.Dob;
                customer.Gender = entity.Gender;

                context.SaveChanges();
            }
        }

        /// <summary>
        /// Thay đổi mật khẩu
        /// </summary>
        /// <param name="key"></param>
        /// <param name="oldPassword"></param>
        /// <param name="newPassword"></param>
        public void ChangePassword(string key, string oldPassword, string newPassword)
        {
            Customer customer = context.Customers
                 .First(x => x.Code == key);

            string passwordCheck = DataHelper.SHA256Hash(customer.Email + "_" + oldPassword);

            if (customer.Password != passwordCheck)
                throw new ArgumentException("Mật khẩu cũ không đúng");
            else
            {
                string newCheck = DataHelper.SHA256Hash(customer.Email + "_" + newPassword);
                customer.Password = newCheck;

                context.SaveChanges();
            }
        }

        public void AddWishListProduct(string key, int productId)
        {
            context.CustomerWishLists.Add(new CustomerWishList()
            {
                CustomerCode = key,
                ProductId = productId,
                Created = DateTime.Now
            });

            context.SaveChanges();
        }

        public void RemoveWishListProduct(string key, int productId)
        {
            CustomerWishList item = context.CustomerWishLists
                .First(x => x.CustomerCode == key && x.ProductId == productId);

            if (item != null)
            {
                context.CustomerWishLists.Remove(item);
                context.SaveChanges();
            }
        }

        /// <summary>
        /// Get danh sách sản phẩm yêu thích
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public List<ProductDto> GetWishListProduct(string key, string orderBy, string price, int take = 30)
        {
            IQueryable<CustomerWishList> query = context.CustomerWishLists
                .Where(x => x.CustomerCode == key)
                .Where(x => x.Product!.Status == 10);
            //.Where(x => x.Product!.Selling == true);

            if (!string.IsNullOrWhiteSpace(orderBy))
            {
                switch (orderBy)
                {
                    case "highlight":
                        break;
                    case "price-asc":
                        query = query.OrderBy(x => x.Product!.DiscountPrice);
                        break;
                    case "price-desc":
                        query = query.OrderByDescending(x => x.Product!.DiscountPrice);
                        break;
                }
            }
            if (!string.IsNullOrWhiteSpace(price))
            {
                switch (price)
                {
                    case "m30":
                        query = query.Where(x => x.Product!.DiscountPrice >= 30000000);
                        break;
                    case "f20t30":
                        query = query.Where(x => x.Product!.DiscountPrice >= 20000000 && x.Product.DiscountPrice < 30000000);
                        break;
                    case "f10t20":
                        query = query.Where(x => x.Product!.DiscountPrice >= 10000000 && x.Product.DiscountPrice < 20000000);
                        break;
                    case "f5t10":
                        query = query.Where(x => x.Product!.DiscountPrice >= 5000000 && x.Product.DiscountPrice < 10000000);
                        break;
                    case "l5":
                        query = query.Where(x => x.Product!.DiscountPrice < 5000000);
                        break;
                }
            }

            List<ProductDto> products = query
                .OrderByDescending(x => x.Created)
                .Select(x => new ProductDto()
                {
                    Id = x.Product!.Id,
                    Name = x.Product.Name,
                    Image = x.Product.Image,
                    Price = x.Product.Price,
                    DiscountPrice = x.Product.DiscountPrice,
                    Alias = x.Product.Alias,
                    ProductAttributes = x.Product.ProductAttributes!.Select(y => new ProductAttributeDto()
                    {
                        Attribute = new AttributeDto()
                        {
                            Id = y.Attribute!.Id,
                            Name = y.Attribute.Name
                        },
                        AttributeId = y.AttributeId,
                        Value = y.Value
                    }).ToList(),
                    Qty = x.Product.Qty,
                })
                .Take(take)
                .ToList();

            ProductService.RestructureAttribute(context, key, products);
            return products;
        }

        public int GetTotalItemWishlist(string? key)
        {
            return context.CustomerWishLists
                .Where(x => x.CustomerCode == key)
                .Where(x => x.Product!.Status == 10)
                .Count();
        }

        public List<CustomerDto> Get(Filter filter)
        {
            IQueryable<Customer> query = context.Customers;

            if (!string.IsNullOrWhiteSpace(filter.keySearch))
            {
                query = query.Where(x => x.FullName.Contains(filter.keySearch));
            }

            return query
                 .Select(x => new CustomerDto()
                 {
                     Code = x.Code,
                     Address = x.Address,
                     Avatar = x.Avatar,
                     Dob = x.Dob,
                     Email = x.Email,
                     FullName = x.FullName,
                     Gender = x.Gender,
                     PhoneNumber = x.PhoneNumber
                 })
                 .ToList();
        }
    }
}