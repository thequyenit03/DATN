using Microsoft.AspNetCore.Mvc;
using Service.Model;
using Service.Service;
using Service.Util;

namespace Service.Controllers
{
    [Route("")]
    [ApiController]
    public class HomeController(IWebHostEnvironment hostEnvironment, PaymentService paymentService) : ControllerBase
    {
        protected IWebHostEnvironment hostEnvironment = hostEnvironment;
        protected PaymentService paymentService = paymentService;
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

        [HttpGet("payment")]
        public IActionResult GetPaymentLink()
        {
            string link = paymentService.CreatePaymentLink(new Order()
            {
                
                Created = DateTime.Now,
                TotalAmount = 100000
            });
            return Ok(link);
        }
        [HttpGet("payment-return")]
        public IActionResult GetPaymentReturn([FromQuery]Dictionary<string, string> query)
        {            
            string result = paymentService.VerifyPayment(query);
            return Ok(result);
        }
    }
}
