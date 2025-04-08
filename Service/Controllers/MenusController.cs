using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenusController(MenuService service) : BaseController<MenuDto, int>(service)
    {
        [Route("get-main-menu")]
        [HttpGet]
        public IActionResult GetMainMenu([FromQuery] Filter filter)
        {
            try
            {
                return Ok(service.GetMainMenu(filter));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-sub-menu")]
        [HttpGet]
        public IActionResult GetSubMenu([FromQuery] Filter filter)
        {
            try
            {
                return Ok(service.GetSubMenu(filter));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-parent-main-menu")]
        [HttpGet]
        public IActionResult GetParentMainMenu()
        {
            try
            {
                return Ok(service.GetParentMainMenu());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-parent-sub-menu")]
        [HttpGet]
        public IActionResult GetParentSubMenu()
        {
            try
            {
                return Ok(service.GetParentSubMenu());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-by-type")]
        [HttpGet]
        public IActionResult GetByType([FromQuery] List<string> types)
        {
            try
            {
                return Ok(service.GetByType(types));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-main-menu-active")]
        [HttpGet]
        public IActionResult GetMainMenuActive()
        {
            try
            {
                return Ok(service.GetMainMenuActive());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-sub-menu-active")]
        [HttpGet]
        public IActionResult GetSubMenuActive()
        {
            try
            {
                return Ok(service.GetSubMenuActive());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-all-menu-homepage")]
        [HttpGet]
        public IActionResult GetAllShowHomePage()
        {
            try
            {
                return Ok(service.GetAllShowHomePage());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
