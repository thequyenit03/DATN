using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController(ArticleService service) : BaseController<ArticleDto, int>(service)
    {
        [Route("get-by-menu")]
        [HttpGet]
        public IActionResult GetByMenu(string menuAlias, int take)
        {
            try
            {
                return Ok(service.GetByMenu(menuAlias, take));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-by-alias/{alias}")]
        [HttpGet]
        public IActionResult GetByAlias(string alias)
        {
            try
            {
                return Ok(service.GetByAlias(alias));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-highlight")]
        [HttpGet]
        public IActionResult GetHighlight()
        {
            try
            {
                return Ok(service.GetHighlight());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
