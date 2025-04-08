using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailRegistrationsController(EmailRegistrationService service) : ControllerBase
    {
        [HttpGet]
        public IActionResult Get([FromQuery] Filter filter)
        {
            try
            {
                return Ok(service.Get(filter));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult Post(EmailRegistrationDto email)
        {
            try
            {
                service.Insert(email);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
