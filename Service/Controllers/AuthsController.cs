using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthsController(UserService service) : ControllerBase
    {
        [HttpPost]
        public IActionResult GetAccessToken(UserDto user)
        {
            try
            {
                return Ok(service.GetAccessToken(user));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
