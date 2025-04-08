using Microsoft.AspNetCore.Mvc;

namespace Service.Controllers
{
    [Route("")]
    [ApiController]
    public class HomeController(IWebHostEnvironment hostEnvironment) : ControllerBase
    {
        protected IWebHostEnvironment hostEnvironment = hostEnvironment;

        [Route("")]
        public IActionResult Get()
        {
            return Ok("Api ready");
        }

        [HttpGet("file/{key}")]
        public IActionResult Get(string key)
        {
            try
            {
                string path = Path.Combine(hostEnvironment.ContentRootPath, "Resources/Images");
                var image = System.IO.File.OpenRead(path + "/" + key);
                return File(image, "image/*");
            }
            catch
            {
                return BadRequest();
            }

        }
    }
}
