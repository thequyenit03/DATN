using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("ProductAttribute")]
    public class ProductAttribute
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int AttributeId { get; set; }
        public required string Value { get; set; }

        public virtual Product? Product { get; set; }
        public virtual Attribute? Attribute { get; set; }
    }
}
