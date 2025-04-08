namespace Service.Dto
{
    public class MenuDto
    {
        public int? Id { get; set; }
        public int? ParentMenu { get; set; }
        public string? Group { get; set; }
        public string? Name { get; set; }
        public string? Alias { get; set; }
        public int? Index { get; set; }
        public bool? ShowHomePage { get; set; }
        public string? Type { get; set; }
        public bool? Active { get; set; }
        public string? ParentMenuName { get; set; }

        public List<MenuDto>? SubMenus { get; set; }

        public List<ProductDto>? Products { get; set; }
        public List<ArticleDto>? Articles { get; set; }
    }
}
