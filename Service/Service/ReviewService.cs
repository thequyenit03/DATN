using Service.Dto;
using Service.Model;
using Service.Util;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Service.Service
{
    public class ReviewService(MyContext context) : IServiceBase<ReviewDto, int>
    {
        protected MyContext context = context;

        public void DeleteById(int key)
        {
            throw new NotImplementedException();
        }

        public List<ReviewDto> Get(Filter filter)
        {
            IQueryable<Review> query = context.Reviews;

            if (!string.IsNullOrWhiteSpace(filter.keySearch))
            {
                query = query.Where(x => x.Content.Contains(filter.keySearch) || x.CreatedBy.Contains(filter.keySearch) || x.Product!.Name.Contains(filter.keySearch));
            }

            if (filter.status > 0)
            {
                query = query.Where(x => x.Status == filter.status);
            }

            return query
                .OrderByDescending(x => x.Created)
                .Select(x => new ReviewDto()
                {
                    Id = x.Id,
                    CreatedBy = x.CreatedBy,
                    Content = x.Content,
                    Created = x.Created,
                    Star = x.Star,
                    Status = x.Status,
                    Product = new ProductDto()
                    {
                        Image = x.Product!.Image,
                        Name = x.Product.Name,
                        Alias = x.Product.Alias
                    }
                }).ToList();
        }

        public void UpdateStatus(int id, int status)
        {
            Review review = context.Reviews.First(x => x.Id == id);

            if (review != null)
            {
                review.Status = status;

                context.SaveChanges();
            }
        }

        public List<ReviewDto> GetAll()
        {
            throw new NotImplementedException();
        }

        public ReviewDto GetById(int key)
        {
            throw new NotImplementedException();
        }

        public ReviewDto GetByOrder(int orderDetailId)
        {
            var query = context.Reviews
                .Where(x => x.OrderDetailId == orderDetailId);
            if (query.Count() == 0)
            {
                return new ReviewDto();
            }

            return query
                .Select(x => new ReviewDto()
                {
                    Id = x.Id,
                    Content = x.Content,
                    Created = x.Created,
                    CreatedBy = x.CreatedBy,
                    Star = x.Star,
                    Status = x.Status
                }).First();
        }

        public ReviewDto Insert(ReviewDto entity)
        {
            if (context.OrderDetails
                .Any(x => x.Id == entity.OrderDetailId && x.Order!.Status == Constants.OrderStatus.DA_GIAO))
            {
                Review review = context.Reviews.FirstOrDefault(x => x.OrderDetailId == entity.OrderDetailId);

                if (review == null)
                {
                    OrderDetail orderDetail = context.OrderDetails.First(x => x.Id == entity.OrderDetailId);
                    review = new Review()
                    {
                        Status = Constants.ReviewStatus.CHO_DUYET,
                        Content = entity.Content,
                        Created = DateTime.Now,
                        CreatedBy = orderDetail.Order!.Customer!.FullName,
                        OrderDetailId = entity.OrderDetailId??0,
                        ProductId = orderDetail.ProductId,
                        Star = entity.Star ?? 0,
                    };

                    context.Reviews.Add(review);
                }
                else
                {
                    if (review.Star != entity.Star || review.Content != entity.Content)
                    {
                        review.Star = entity.Star ?? 0;
                        review.Content = entity.Content;
                        if (review.Status == Constants.ReviewStatus.DA_DUYET)
                            review.Status = Constants.ReviewStatus.CAP_NHAT_LAI_CHO_DUYET;
                    }
                }
                context.SaveChanges();
            }

            return entity;
        }


        public void Update(int key, ReviewDto entity)
        {
            throw new NotImplementedException();
        }
    }
}
