using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController(CustomerService service, IHttpContextAccessor contextAccessor) : BaseController<CustomerDto, string>(service)
    {
        protected IHttpContextAccessor contextAccessor = contextAccessor;

        [Route("login")]
        [HttpPost]
        public IActionResult GetAccessToken(CustomerDto customer)
        {
            try
            {
                return Ok(service.GetAccessToken(customer));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("request-otp")]
        [HttpGet]
        public IActionResult RequestOTP(string email)
        {
            try
            {
                service.RequestOTP(email);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("confirm-otp")]
        [HttpGet]
        public IActionResult RequestOTP(string email, string otp)
        {
            try
            {
                return Ok(service.ConfirmOTP(email, otp));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("forgot-password")]
        [HttpGet]
        public IActionResult ForgotPassword(string email)
        {
            try
            {
                service.ForgotPassword(email);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-profile")]
        [SystemAuthorize]
        [HttpGet]
        public IActionResult GetProfile()
        {
            try
            {
                string userSession = SystemAuthorization.GetCurrentUser(contextAccessor);
                return Ok(service.GetById(userSession));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-orders")]
        [SystemAuthorize]
        [HttpGet]
        public IActionResult GetOrders()
        {
            try
            {
                string userSession = SystemAuthorization.GetCurrentUser(contextAccessor);
                return Ok(service.GetOrders(userSession));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("update-profile")]
        [SystemAuthorize]
        [HttpPut]
        public IActionResult Put(CustomerDto customer)
        {
            try
            {
                string userSession = SystemAuthorization.GetCurrentUser(contextAccessor);
                service.Update(userSession, customer);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("change-password")]
        [SystemAuthorize]
        [HttpGet]
        public IActionResult ChangePassword(string oldPassword, string newPassword)
        {
            try
            {
                string userSession = SystemAuthorization.GetCurrentUser(contextAccessor);
                service.ChangePassword(userSession, oldPassword, newPassword);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("add-wishlist-product")]
        [SystemAuthorize]
        [HttpGet]
        public IActionResult AddWishListProduct(int productId)
        {
            try
            {
                string userSession = SystemAuthorization.GetCurrentUser(contextAccessor);
                service.AddWishListProduct(userSession, productId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("remove-wishlist-product")]
        [SystemAuthorize]
        [HttpGet]
        public IActionResult RemoveWishListProduct(int productId)
        {
            try
            {
                string userSession = SystemAuthorization.GetCurrentUser(contextAccessor);
                service.RemoveWishListProduct(userSession, productId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-wishlist-product")]
        [SystemAuthorize]
        [HttpGet]
        public IActionResult GetWishListProduct(string orderBy, string price, int take)
        {
            try
            {
                string userSession = SystemAuthorization.GetCurrentUser(contextAccessor);
                return Ok(service.GetWishListProduct(userSession, orderBy, price, take));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-total-wishlist")]
        [SystemAuthorize]
        [HttpGet]
        public IActionResult GetTotalItemWishlist()
        {
            try
            {
                string? userSession = SystemAuthorization.TryGetCurrentUser(contextAccessor);
                return Ok(service.GetTotalItemWishlist(userSession));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
