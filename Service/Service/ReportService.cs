using Service.Dto;
using Service.Model;
using Service.Util;

namespace Service.Service
{
    public class ReportService(MyContext context)
    {
        protected MyContext context = context;

        public ReportHighlight GetHighlight(DateTime date)
        {
            ReportHighlight highlight = new()
            {
                TotalNewOrder = context.Orders
                    .Where(x => x.Created.Day == date.Day &&
                                x.Created.Month == date.Month &&
                                x.Created.Year == date.Year)
                    .Count(),

                DailySales = context.Orders
                    .Where(x => x.Created.Day == date.Day &&
                                x.Created.Month == date.Month &&
                                x.Created.Year == date.Year)
                    .Sum(x => x.TotalAmount == null ? 0 : x.TotalAmount) ?? 0,

                TotalOrder = context.Orders
                   .Where(x => x.Created.Month == date.Month &&
                               x.Created.Year == date.Year)
                   .Count(),

                SalesRevenue = context.Orders
                   .Where(x => x.Created.Month == date.Month &&
                               x.Created.Year == date.Year)
                    .Sum(x => x.TotalAmount == null ? 0 : x.TotalAmount) ?? 0,

                OrderQty = [],
                OrderQtyByStatus = [],
                Revenues = [],
            };

            DateTime dateNow = DateTime.Now;

            for (int i = 1; i < 13; i++)
            {
                int totalOrder = context.Orders
                            .Where(x => x.Created.Month == i &&
                                        x.Created.Year == date.Year)
                            .Count();

                double totalAmount = context.Orders
                            .Where(x => x.Created.Month == i &&
                                        x.Created.Year == date.Year)
                            .Sum(x => x.TotalAmount == null ? 0 : x.TotalAmount) ?? 0;

                if ((date.Year == dateNow.Year && dateNow.Month >= i) || date.Year == dateNow.Year)
                {
                    highlight.OrderQty.Add(totalOrder);
                }
                highlight.Revenues.Add(totalAmount);
            }

            new List<int>()
            {
                Constants.OrderStatus.CHO_XAC_NHAN,
                Constants.OrderStatus.DA_XAC_NHAN,
                Constants.OrderStatus.DANG_VAN_CHUYEN,
                Constants.OrderStatus.DA_GIAO,
                Constants.OrderStatus.DA_HUY,
            }.ForEach(status =>
            {
                highlight.OrderQtyByStatus.Add(context.Orders
                        .Where(x => x.Status == status)
                        .Where(x => x.Created.Month == date.Month &&
                                    x.Created.Year == date.Year)
                        .Count());
            });

            return highlight;
        }

        public List<OrderDto> GetGeneralReport(Filter filter)
        {
            var query = context.Orders.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.keySearch))
                query = query.Where(x => x.Id.ToString().Contains(filter.keySearch) || x.Customer!.FullName.Contains(filter.keySearch));

            if (filter.status > 0)
                query = query.Where(x => filter.status < 0 || x.Status == filter.status);

            if (filter.fDate.HasValue && filter.tDate.HasValue)
            {
                DateTime fd = filter.fDate.Value.Date;
                DateTime td = filter.tDate.Value.AddDays(1).Date;
                query = query.Where(x => x.Created >= fd && x.Created < td);
            }

            return query
                .OrderByDescending(x => x.Created)
                .Select(x => new OrderDto()
                {
                    Id = x.Id,
                    Created = x.Created,
                    Address = x.Address,
                    PhoneNumber = x.PhoneNumber,
                    Customer = new CustomerDto()
                    {
                        FullName = x.Customer!.FullName,
                    },
                    Note = x.Note,
                    Status = x.Status,
                    TotalAmount = x.TotalAmount,
                })
                .ToList();
        }

        public List<ProductDto> GetProductReport(Filter filter)
        {
            IQueryable<Product> query = context.Products;
            if (!string.IsNullOrWhiteSpace(filter.keySearch))
            {
                query = query.Where(x => x.Name.Contains(filter.keySearch));
            }

            List<ProductDto> productDtos = query
                .Select(x => new ProductDto()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Image = x.Image,
                    TotalQty = 0,
                    TotalAmount = 0
                }).ToList();

            foreach (var item in productDtos)
            {
                var queryDetail = context.OrderDetails
                    .Where(x => x.ProductId == item.Id);

                if (filter.fDate.HasValue && filter.tDate.HasValue)
                {
                    DateTime fd = filter.fDate.Value.Date;
                    DateTime td = filter.tDate.Value.AddDays(1).Date;
                    queryDetail = queryDetail.Where(x => x.Order!.Created >= fd && x.Order.Created < td);
                }

                item.TotalQty = queryDetail.Sum(x => x.Qty);
                item.TotalAmount = queryDetail.Sum(x => x.Qty * x.ProductDiscountPrice);
            }

            return productDtos
                .OrderByDescending(x => x.TotalAmount)
                .ThenByDescending(x => x.TotalQty).ToList();
        }

        public object GetRevenueReport(DateTime date)
        {
            List<double> revenues = [];
            List<int> orderQty = [];

            for (int i = 1; i < 13; i++)
            {
                int totalOrder = context.Orders
                            .Where(x => x.Created.Month == i &&
                                        x.Created.Year == date.Year)
                            .Count();

                double totalAmount = context.Orders
                            .Where(x => x.Created.Month == i &&
                                        x.Created.Year == date.Year)
                            .Sum(x => x.TotalAmount == null ? 0 : x.TotalAmount) ?? 0;

                orderQty.Add(totalOrder);
                revenues.Add(totalAmount);
            }

            return new
            {
                revenues,
                orderQty
            };
        }
    }
}
