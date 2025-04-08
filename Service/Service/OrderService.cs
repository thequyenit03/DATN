using Microsoft.EntityFrameworkCore;
using Service.Dto;
using Service.Model;
using Service.Util;
using System.Text;

namespace Service.Service
{
    public class OrderService(MyContext context) : IServiceBase<OrderDto, int>
    {
        protected MyContext context = context;

        public void DeleteById(int key)
        {
            throw new NotImplementedException();
        }

        public List<OrderDto> Get(Filter filter)
        {
            var query = context.Orders.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.keySearch))
                query = query.Where(x => x.Id.ToString().Contains(filter.keySearch) || x.Customer!.FullName.Contains(filter.keySearch));

            if (filter.status > 0)
                query = query.Where(x => x.Status == filter.status);

            if (filter.fDate.HasValue && filter.tDate.HasValue)
            {
                DateTime fd = filter.fDate.Value.Date;
                DateTime td = filter.tDate.Value.AddDays(1).Date;
                query = query.Where(x => x.Created >= fd && x.Created < td);
            }
           var a= query
                .OrderByDescending(x => x.Created)
                .Select(x => new OrderDto()
                {
                    Id = x.Id,
                    Created = x.Created,
                    Address = x.Address,
                    PhoneNumber = x.PhoneNumber,
                    Customer = new CustomerDto()
                    {
                        FullName = x.Customer!.FullName,
                    },
                    Note = x.Note,
                    Status = x.Status,
                    TotalAmount = x.TotalAmount,
                })
                .ToList();

            return a;
        }

        /// <summary>
        /// Get danh sách đơn hàng chờ xử lý
        /// </summary>
        /// <param name="keySearch"></param>
        /// <param name="status"></param>
        /// <param name="fDate"></param>
        /// <param name="tDate"></param>
        /// <returns></returns>
        public List<OrderDto> GetWIP(Filter filter)
        {
            var query = context.Orders.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.keySearch))
                query = query.Where(x => x.Id.ToString().Contains(filter.keySearch) || x.Customer!.FullName.Contains(filter.keySearch));

            if (filter.status > 0)
                query = query.Where(x => x.Status == filter.status);

            if (filter.fDate.HasValue && filter.tDate.HasValue)
            {
                DateTime fd = filter.fDate.Value.Date;
                DateTime td = filter.tDate.Value.AddDays(1).Date;
                query = query.Where(x => x.Created >= fd && x.Created < td);
            }

           var a= query
                .Where(x => x.Status != Constants.OrderStatus.DA_HUY && x.Status != Constants.OrderStatus.DA_GIAO)
                .OrderByDescending(x => x.Created)
                .Select(x => new OrderDto()
                {
                    Id = x.Id,
                    Created = x.Created,
                    Address = x.Address,
                    PhoneNumber = x.PhoneNumber,
                    Customer = new CustomerDto()
                    {
                        FullName = x.Customer!.FullName,
                    },
                    Note = x.Note,
                    Status = x.Status,
                    TotalAmount = x.TotalAmount,
                })
                .ToList();

            return a;
        }

        public List<OrderDto> GetAll()
        {
            return context.Orders
                .OrderByDescending(x => x.Created)
                .Select(x => new OrderDto()
                {
                    Id = x.Id,
                    Created = x.Created,
                    Customer = new CustomerDto()
                    {
                        Address = x.Customer!.Address,
                        Email = x.Customer.Email,
                        FullName = x.Customer.FullName,
                        PhoneNumber = x.Customer.PhoneNumber,
                    },
                    Note = x.Note,
                    Status = x.Status,
                    TotalAmount = x.TotalAmount,
                })
                .ToList();
        }

        public OrderDto GetById(int key)
        {
            return context.Orders
                .Where(x => x.Id == key)
                .Select(x => new OrderDto()
                {
                    Id = x.Id,
                    Created = x.Created,
                    Customer = new CustomerDto()
                    {
                        Address = x.Customer!.Address,
                        Email = x.Customer.Email,
                        FullName = x.Customer.FullName,
                        PhoneNumber = x.Customer.PhoneNumber,
                    },
                    Note = x.Note,
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
                        Attribute = y.Attribute
                    }).ToList()
                })
                .First();
        }

        /// <summary>
        /// Cập nhật trạng thái đơn hàng
        /// </summary>
        /// <param name="key"></param>
        /// <param name="status"></param>
        public void ChangeStatus(int key, int status)
        {
            Order order = context.Orders.First(x => x.Id == key);

            order.Status = status;
            context.SaveChanges();
        }

        public  OrderDto Insert(OrderDto entity)
        {
            DateTime dateNow = DateTime.Now;
            Order order = new()
            {
                CustomerCode = entity.Customer!.Code,
                PhoneNumber = entity.Customer!.PhoneNumber,
                Address = entity.Customer.Address,
                Note = entity.Note,
                Status = Constants.OrderStatus.CHO_XAC_NHAN,
                Created = dateNow,
            };

            List<OrderDetail> orderDetails = [];
            foreach (var item in entity.OrderDetails!)
            {
                Product product = context.Products.First(y => y.Id == item.ProductId);

                if (product.Qty < item.Qty)
                {
                    throw new Exception($"Số lượng sản phẩm {product.Name} không đủ trong kho: (Còn lại {product.Qty})");
                }

                orderDetails.Add(new OrderDetail()
                {
                    ProductId = product.Id,
                    ProductDiscountPrice = product.DiscountPrice,
                    ProductPrice = product.Price,
                    ProductImage = product.Image!,
                    ProductName = product.Name,
                    Qty = item.Qty,
                    Attribute = item.Attribute!.Trim()
                });

                product.Qty -= (item.Qty ?? 0);
            }

            order.OrderDetails = orderDetails;
            order.TotalAmount = orderDetails.Sum(x => x.Qty * x.ProductDiscountPrice);

            context.Orders.Add(order);
            context.SaveChanges();

            // gửi mail đặt hàng thành công
            try
            {
                string orderDetail = @"<table>
                                                <thead>
                                                    <tr style='background: #5189B9;color: white;'>
                                                        <th>Tên sản phẩm</th>
                                                        <th>Số lượng</th>
                                                        <th>Đơn giá</th>
                                                        <th>Thành tiền</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{0}<tr><td colSpan='3'>Tổng tiền:</td><td>{1}</td></tr></tbody>
                                        </table>";

                StringBuilder sbOrderDetail = new();
                orderDetails.ForEach(x =>
                {
                    sbOrderDetail.Append($"<tr><td>{x.ProductName}</td><td>{x.Qty}</td><td>{DataHelper.ToCurrency(x.ProductDiscountPrice)}</td><td>{DataHelper.ToCurrency(x.ProductDiscountPrice * x.Qty)}</td></tr>");
                });

                string htmlBody = @$"
                        <html lang=""en"">
                            <head>    
                                <meta content=""text/html; charset=utf-8"" http-equiv=""Content-Type"">
                                <title>
                                    DEcommerce
                                </title>
                                <style type=""text/css"">
                                   table th,
                                    table td {{
                                        border: 1px solid #dcdcdc;
                                        padding: 2px 10px;
                                    }}

                                    table {{
                                        border-collapse: collapse;
                                    }}
                                </style>
                            </head>
                            <body>
                                 {string.Format(orderDetail, sbOrderDetail.ToString(), DataHelper.ToCurrency(order.TotalAmount))}
                            </body>
                        </html>
                        ";
                // Gửi mail cho khách hàng
                EmailConfiguration emailConfiguration = context.EmailConfigurations.First();
                Customer customer = context.Customers.First(x => x.Code == entity.Customer.Code);

                {
                    EmailTemplate emailTemplateOrderSuccessful = context.EmailTemplates.First(x => x.Id == 3);

                    string bodyMail = emailTemplateOrderSuccessful.Content
                        .Replace(Constants.EmailKeyGuide.OrderCode, order.Id.ToString())
                        .Replace(Constants.EmailKeyGuide.OrderDate, dateNow.ToString("HH:mm dd-MM-yyyy"))
                        .Replace(Constants.EmailKeyGuide.Customer, customer.FullName)
                        .Replace(Constants.EmailKeyGuide.Address, entity.Customer.Address)
                        .Replace(Constants.EmailKeyGuide.OrderDetail, htmlBody);

                    DataHelper.SendMail(emailConfiguration, emailTemplateOrderSuccessful.Subject!, bodyMail,
                    [
                        customer.Email!
                    ], emailTemplateOrderSuccessful.CC?.Split(';').ToList(), emailTemplateOrderSuccessful.BCC?.Split(';').ToList());
                }

                // gửi mail cho quản trị

                {
                    EmailTemplate emailTemplateNotifyNewOrder = context.EmailTemplates.First(x => x.Id == 4);
                    string bodyMail = emailTemplateNotifyNewOrder.Content
                            .Replace(Constants.EmailKeyGuide.OrderCode, order.Id.ToString())
                            .Replace(Constants.EmailKeyGuide.OrderDate, dateNow.ToString("HH:mm dd-MM-yyyy"))
                            .Replace(Constants.EmailKeyGuide.Customer, customer.FullName)
                            .Replace(Constants.EmailKeyGuide.Address, entity.Customer.Address)
                            .Replace(Constants.EmailKeyGuide.OrderDetail, htmlBody);

                    DataHelper.SendMail(emailConfiguration, emailTemplateNotifyNewOrder.Subject!, bodyMail,
                        emailTemplateNotifyNewOrder.CC?.Split(';').ToList() ?? [],
                        emailTemplateNotifyNewOrder.CC?.Split(';').ToList(),
                        emailTemplateNotifyNewOrder.BCC?.Split(';').ToList());
                }

            }
            catch
            {
            }

            return entity;
        }

        public void Update(int key, OrderDto entity)
        {
            Order order = context.Orders
               .First(x => x.Id == key);

            order.Status = entity.Status!.Value;
            order.Note = entity.Note;

            context.SaveChanges();
        }

    }
}
