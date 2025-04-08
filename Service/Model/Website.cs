using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("Website")]
    public class Website
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Logo { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Fax { get; set; }
        public required string Email { get; set; }
        public required string Address { get; set; }
        public required string Location { get; set; }
        public required string Facebook { get; set; }
        public required string Youtube { get; set; }
        public required string Copyright { get; set; }

    }
}
