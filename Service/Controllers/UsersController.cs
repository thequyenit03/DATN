using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [SystemAuthorize]
    public class UsersController(UserService service) : BaseController<UserDto, string>(service)
    {
        [Route("reset-passsword")]
        [HttpGet]
        public IActionResult ResetPassword(string username, string newPassword)
        {
            try
            {
                service.ResetPassword(username, newPassword);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
