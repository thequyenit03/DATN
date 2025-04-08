using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController(ReviewService service) : BaseController<ReviewDto, int>(service)
    {
        protected ReviewService service = service;

        [Route("update-status/{id}")]
        [HttpGet]
        public IActionResult UpdateStatus(int id, int status)
        {
            try
            {
                service.UpdateStatus(id, status);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-by-order/{orderDetailId}")]
        [HttpGet]
        public IActionResult GetByOrder(int orderDetailId)
        {
            try
            {
                return Ok(service.GetByOrder(orderDetailId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
