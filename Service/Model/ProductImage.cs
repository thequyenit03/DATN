using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("ProductImage")]
    public class ProductImage
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public required string Image { get; set; }

        public virtual Product? Product { get; set; }
    }
}
