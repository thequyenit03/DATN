using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [SystemAuthorize]
    public class ProvidersController(ProviderService service) : BaseController<ProviderDto, string>(service)
    {
    }
}
