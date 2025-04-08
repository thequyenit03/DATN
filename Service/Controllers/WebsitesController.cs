using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebsitesController(WebsiteService service) : BaseController<WebsiteDto, int>(service)
    {
    }
}
