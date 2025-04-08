using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("Product")]
    public class Product
    {
        public int Id { get; set; }
        public string? ProviderCode { get; set; }
        public int MenuId { get; set; }
        public required string Name { get; set; }
        public required string Alias { get; set; }
        public string? Image { get; set; }
        public int? Index { get; set; }
        public int? Status { get; set; } // 10 đang bán - 20 dừng bán - 30 hết hàng
        public double? Price { get; set; }
        public double? DiscountPrice { get; set; }
        public bool? Selling { get; set; }
        public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        public int Qty { get; set; }

        public virtual Provider? Provider { get; set; }
        public virtual Menu? Menu { get; set; }
        public virtual ICollection<ProductAttribute>? ProductAttributes { get; set; }
        public virtual ICollection<ProductImage>? ProductImages { get; set; }
        public virtual ICollection<ProductRelated>? ProductRelateds { get; set; }
        public virtual ICollection<Review>? Reviews { get; set; }
    }
}
