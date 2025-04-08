using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("Attribute")]
    public class Attribute
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        public virtual ICollection<ProductAttribute>? ProductAttributes { get; set; }
    }
}
