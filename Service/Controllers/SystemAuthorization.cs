using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using Service.Util;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace Service.Controllers
{
    public class SystemAuthorization : IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            string token = context.HttpContext.Request.Headers.Authorization.ToString();
            if (string.IsNullOrWhiteSpace(token))
            {
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                context.Result = new JsonResult("Lỗi xác thực");
            }
            else
            {
                try
                {
                    ClaimsPrincipal claimsPrincipal = DecodeJWTToken(token, Constants.JwtConfig.SecretKey);
                    context.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
                }
                catch
                {
                    context.HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    context.Result = new JsonResult("Lỗi xác thực");
                }
            }
        }

        public static string GetCurrentUser(IHttpContextAccessor context)
        {
            try
            {
                string token = context.HttpContext!.Request.Headers.Authorization.ToString();
                ClaimsPrincipal claimsPrincipal = DecodeJWTToken(token, Constants.JwtConfig.SecretKey);
                return claimsPrincipal.FindFirstValue(ClaimTypes.UserData)!;
            }
            catch
            {
                throw new ArgumentException("Lỗi xác thực");
            }
        }

        public static string? TryGetCurrentUser(IHttpContextAccessor context)
        {
            try
            {
                string token = context.HttpContext!.Request.Headers.Authorization.ToString();
                ClaimsPrincipal claimsPrincipal = DecodeJWTToken(token, Constants.JwtConfig.SecretKey);
                return claimsPrincipal.FindFirstValue(ClaimTypes.UserData)!;
            }
            catch
            {
                return null;
            }
        }

        public static ClaimsPrincipal DecodeJWTToken(string token, string secretAuthKey)
        {
            var key = Encoding.ASCII.GetBytes(secretAuthKey);
            var handler = new JwtSecurityTokenHandler();
            var validations = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false
            };
            var claims = handler.ValidateToken(token, validations, out _);
            return claims;
        }
    }
    public class SystemAuthorizeAttribute : TypeFilterAttribute
    {
        public SystemAuthorizeAttribute() : base(typeof(SystemAuthorization))
        {
        }
    }
}
