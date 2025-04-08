using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("User")]
    public class User
    {
        [Key]
        public required string UserName { get; set; }
        public required string? Password { get; set; }
        public required string? FullName { get; set; }
        public required string? Phone { get; set; }
        public required string? Email { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool Active { get; set; }
    }
}
