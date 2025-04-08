using System.ComponentModel.DataAnnotations.Schema;

namespace Service.Model
{
    [Table("Menu")]
    public class Menu
    {
        public int Id { get; set; }
        public int? ParentMenu { get; set; }
        public required string Group { get; set; }
        public required string Name { get; set; }
        public required string Alias { get; set; }
        public int? Index { get; set; }
        public bool? ShowHomePage { get; set; }
        public required string Type { get; set; }
        public bool Active { get; set; }

        [ForeignKey("ParentMenu")]
        public virtual Menu? PMenu { get; set; }
        public virtual ICollection<Article>? Articles { get; set; }
        public virtual ICollection<Product>? Products { get; set; }
    }
}
