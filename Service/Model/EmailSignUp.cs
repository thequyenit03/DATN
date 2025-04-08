using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("EmailSignUp")]
    public class EmailSignUp
    {
        [Key]
        public required string Email { get; set; }
        public required string OTP { get; set; }
    }
}
