using Microsoft.IdentityModel.Tokens;
using Service.Dto;
using Service.Model;
using Service.Util;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Service.Service
{
    public class UserService(MyContext context) : IServiceBase<UserDto, string>
    {
        protected MyContext context = context;

        public void DeleteById(string key)
        {
            User user = context.Users.First(x => x.UserName == key);
            context.Users.Remove(user);

            context.SaveChanges();
        }

        public List<UserDto> GetAll()
        {
            return context.Users
                .Select(x => new UserDto()
                {
                    UserName = x.UserName,
                    FullName = x.FullName,
                    Email = x.Email,
                    LastLogin = x.LastLogin,
                    Phone = x.Phone,
                    Active = x.Active
                })
                .ToList();
        }

        public List<UserDto> Get(Filter filter)
        {
            IQueryable<User> query = context.Users;

            if (!string.IsNullOrWhiteSpace(filter.keySearch))
            {
                query = query.Where(x => x.UserName.Contains(filter.keySearch) || x.FullName.Contains(filter.keySearch));
            }

            return query
                 .Select(x => new UserDto()
                 {
                     UserName = x.UserName,
                     FullName = x.FullName,
                     Email = x.Email,
                     LastLogin = x.LastLogin,
                     Phone = x.Phone,
                     Active = x.Active
                 })
                 .ToList();
        }

        public UserDto GetById(string key)
        {
            return context.Users
               .Where(x => x.UserName == key)
               .Select(x => new UserDto()
               {
                   UserName = x.UserName,
                   FullName = x.FullName,
                   Email = x.Email,
                   LastLogin = x.LastLogin,
                   Phone = x.Phone,
                   Active = x.Active
               })
               .First();
        }

        public UserDto Insert(UserDto entity)
        {
            if (context.Users.Any(x => x.UserName == entity.UserName))
                throw new ArgumentException("Tên tài khoản đã tồn tại");

            User user = new()
            {
                UserName = entity.UserName!,
                Phone = entity.Phone!,
                Active = entity.Active!.Value,
                Email = entity.Email!,
                FullName = entity.FullName!,
                Password = DataHelper.SHA256Hash(entity.UserName + "_" + entity.Password),
            };

            context.Users.Add(user);

            context.SaveChanges();

            return entity;
        }

        public void Update(string key, UserDto entity)
        {
            User user = context.Users.First(x => x.UserName == key);

            user.Phone = entity.Phone!;
            user.Active = entity.Active!.Value;
            user.Email = entity.Email!;
            user.FullName = entity.FullName!;

            context.SaveChanges();
        }

        public void ResetPassword(string key, string newPassword)
        {
            User user = context.Users.First(x => x.UserName == key);

            user.Password = DataHelper.SHA256Hash(user.UserName + "_" + newPassword);
            context.SaveChanges();
        }

        public object GetAccessToken(UserDto entity)
        {
            User user = context.Users
                .Where(x => x.Active)
                .First(x => x.UserName == entity.UserName) ?? throw new ArgumentException("Tài khoản hoặc mật khẩu không đúng");
            string passwordCheck = DataHelper.SHA256Hash(entity.UserName + "_" + entity.Password);

            if (user.Password != passwordCheck)
                throw new ArgumentException("Tài khoản hoặc mật khẩu không đúng");

            user.LastLogin = DateTime.Now;
            context.SaveChanges();

            DateTime expirationDate = DateTime.Now.Date.AddMinutes(Constants.JwtConfig.ExpirationInMinutes);
            long expiresAt = (long)(expirationDate - new DateTime(1970, 1, 1)).TotalSeconds;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Constants.JwtConfig.SecretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                [
                        new Claim(ClaimTypes.UserData, user.UserName),
                        new Claim(ClaimTypes.Expiration, expiresAt.ToString())
                ]),
                Expires = expirationDate,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new
            {
                user.UserName,
                user.FullName,
                Token = tokenHandler.WriteToken(token),
                ExpiresAt = expiresAt
            };
        }
    }
}
