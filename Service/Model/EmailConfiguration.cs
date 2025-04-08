using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("EmailConfiguration")]
    public class EmailConfiguration
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }

    }
}
