using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [SystemAuthorize]
    public class AttributesController(AttributeService service) : BaseController<AttributeDto, int>(service)
    {
    }
}
