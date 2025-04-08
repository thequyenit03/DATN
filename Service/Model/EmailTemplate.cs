using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("EmailTemplate")]
    public class EmailTemplate
    {
        public int Id { get; set; }
        public required string Type { get; set; }
        public string? Subject { get; set; }
        public string? CC { get; set; }
        public string? BCC { get; set; }
        public string? KeyGuide { get; set; }
        public required string Content { get; set; }

    }
}
