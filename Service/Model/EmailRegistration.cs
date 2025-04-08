using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("EmailRegistration")]
    public class EmailRegistration
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public DateTime Created { get; set; }

    }
}
