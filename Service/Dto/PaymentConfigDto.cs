
using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Dto
{    
    public class PaymentConfigDto
    {
        public int Id { get; set; }
        public string TerminalId { get; set; }
        public string SecretKey { get; set; }
        public string Url { get; set; }
        public bool IsProduction { get; set; }
    }
}
