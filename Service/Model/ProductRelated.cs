using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("ProductRelated")]
    public class ProductRelated
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int ProductRelatedId { get; set; }

        public virtual Product? Product { get; set; }
    }
}
