namespace Service.Dto
{
    public class ReportHighlight
    {
        public int TotalNewOrder { get; set; }
        public double DailySales { get; set; }
        public int TotalOrder { get; set; }
        public double SalesRevenue { get; set; }

        public List<int>? OrderQtyByStatus { get; set; }
        public List<int>? OrderQty { get; set; }
        public List<double>? Revenues { get; set; }
    }
}
