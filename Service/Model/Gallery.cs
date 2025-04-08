using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("Gallery")]
    public class Gallery
    {
        public int Id { get; set; }
        public required string Image { get; set; }
        public int Type { get; set; }

    }
}
