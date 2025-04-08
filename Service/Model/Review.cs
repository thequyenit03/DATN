using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("Review")]
    public class Review
    {
        public int Id { get; set; }
        public int OrderDetailId { get; set; }
        public int ProductId { get; set; }
        public int Star { get; set; }
        public required string Content { get; set; }
        public int Status { get; set; }
        public DateTime Created { get; set; }
        public required string CreatedBy { get; set; }

        public virtual Product? Product { get; set; }
        public virtual OrderDetail? OrderDetail { get; set; }
    }
}
