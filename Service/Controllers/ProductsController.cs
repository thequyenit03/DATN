using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController(ProductService service, IHttpContextAccessor contextAccessor) : BaseController<ProductDto, int>(service)
    {
        protected IHttpContextAccessor contextAccessor = contextAccessor;

        [Route("search")]
        [HttpGet]
        public IActionResult Search([FromQuery] Filter filter)
        {
            try
            {
                return Ok(service.Search(filter));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-product-selling")]
        [HttpGet]
        public IActionResult GetProductSelling()
        {
            try
            {
                string? userSession = SystemAuthorization.TryGetCurrentUser(contextAccessor);

                return Ok(service.GetProductSelling(userSession));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-by-menu")]
        [HttpGet]
        public IActionResult GetByMenu([FromQuery] Filter filter)
        {
            try
            {
                string? userSession = SystemAuthorization.TryGetCurrentUser(contextAccessor);
                return Ok(service.GetByMenu(userSession, filter));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-by-alias")]
        [HttpGet]
        public IActionResult GetByAlias(string alias)
        {
            try
            {
                string? userSession = SystemAuthorization.TryGetCurrentUser(contextAccessor);
                return Ok(service.GetByAlias(userSession, alias));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
