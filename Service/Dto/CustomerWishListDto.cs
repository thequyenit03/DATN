namespace Service.Dto
{
    public class CustomerWishListDto
    {
        public int? Id { get; set; }
        public string? CustomerCode { get; set; }
        public int? ProductId { get; set; }
        public DateTime? Created { get; set; }
    }
}
