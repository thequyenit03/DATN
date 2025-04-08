namespace Service.Dto
{
    public class ProductAttributeDto
    {
        public int? Id { get; set; }
        public int? ProductId { get; set; }
        public int? AttributeId { get; set; }
        public string? Value { get; set; }

        public AttributeDto? Attribute { get; set; }
    }
}
