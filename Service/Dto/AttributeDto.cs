namespace Service.Dto
{
    public class AttributeDto
    {
        public int? Id { get; set; }
        public string? Name { get; set; }

        public List<ProductAttributeDto>? ProductAttributes { get; set; }
    }
}
