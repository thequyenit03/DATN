using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [SystemAuthorize]
    public class ReportsController(ReportService service) : ControllerBase
    {
        [Route("highlight")]
        [HttpGet]
        public IActionResult GetHighlight(DateTime date)
        {
            try
            {
                return Ok(service.GetHighlight(date));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("general")]
        [HttpGet]
        public IActionResult GetGeneralReport([FromQuery] Filter filter)
        {
            try
            {
                return Ok(service.GetGeneralReport(filter));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("product-report")]
        [HttpGet]
        public IActionResult GetProductReport([FromQuery] Filter filter)
        {
            try
            {
                return Ok(service.GetProductReport(filter));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("revenue")]
        [HttpGet]
        public IActionResult GetRevenueReport(DateTime date)
        {
            try
            {
                return Ok(service.GetRevenueReport(date));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
