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

        [HttpPost("api/payment")]
        public IActionResult GetPaymentLink([FromBody] PaymentRequest request)
        {
            if (request == null || request.totalAmount <= 0)
            {
                return BadRequest("Invalid amount");
            }
            string link = paymentService.CreatePaymentLink(new Order()
            {                
                Created = DateTime.Now,
                TotalAmount = (double?)request.totalAmount
            });
            return Ok(link);
        }
        [HttpGet("api/payment-return")]
        public IActionResult GetPaymentReturn([FromQuery] Dictionary<string, string> query)
        {
            string result = paymentService.VerifyPayment(query);
            // Trả về kết quả ở dạng JSON cho phía frontend nhận và xử lý
            return Ok(new { status = result });
        }
        public class PaymentRequest
        {
            public decimal totalAmount { get; set; }
        }
    }
}
