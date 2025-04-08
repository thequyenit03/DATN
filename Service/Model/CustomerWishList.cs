using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("CustomerWishList")]
    public class CustomerWishList
    {
        public int Id { get; set; }
        public string CustomerCode { get; set; } = "";
        public int ProductId { get; set; }
        public DateTime Created { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual Product? Product { get; set; }
    }
}
