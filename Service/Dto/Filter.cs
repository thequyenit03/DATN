namespace Service.Dto
{
    public class Filter
    {
        public string? keySearch { get; set; }
        public string? orderBy { get; set; }
        public string? price { get; set; }
        public string? menuAlias { get; set; }

        public int? status { get; set; }
        public int? menuId { get; set; }
        public int? take { get; set; }//30
        public DateTime? fDate { get; set; }
        public DateTime? tDate { get; set; }
    }
}