using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController(OrderService service) : BaseController<OrderDto, int>(service)
    {
        [Route("get-wip")]
        [HttpGet]
        public IActionResult GetWIP([FromQuery] Filter filter)
        {
            try
            {
                return Ok(service.GetWIP(filter));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("change-status")]
        [HttpGet]
        public IActionResult ChangeStatus(int id, int status)
        {
            try
            {
                service.ChangeStatus(id, status);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
