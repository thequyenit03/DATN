using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [SystemAuthorize]
    public class EmailTemplatesController(EmailTemplateService service) : BaseController<EmailTemplateDto, int>(service)
    {
    }
}
