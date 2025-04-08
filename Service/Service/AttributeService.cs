using Service.Dto;

namespace Service.Service
{
    public class AttributeService(MyContext context) : IServiceBase<AttributeDto, int>
    {
        protected MyContext context = context;

        /// <summary>
        /// Xóa thuộc tính
        /// </summary>
        /// <param name="key"></param>
        /// <param name="userSession"></param>
        public void DeleteById(int key)
        {
            if (context.ProductAttributes.Any(x => x.AttributeId == key))
                throw new ArgumentException("Dữ liệu đang được sử dụng");

            Model.Attribute attribute = context.Attributes.First(x => x.Id == key);

            if (attribute != null)
            {
                context.Attributes.Remove(attribute);
                context.SaveChanges();
            }
        }

        /// <summary>
        /// Get thuộc tính theo từ khóa
        /// </summary>
        /// <param name="keySearch"></param>
        /// <returns></returns>
        public List<AttributeDto> Get(Filter filter)
        {
            IQueryable<Model.Attribute> query = context.Attributes;

            if (!string.IsNullOrWhiteSpace(filter.keySearch))
            {
                query = query.Where(x => x.Name.Contains(filter.keySearch));
            }

            return query
                .Select(x => new AttributeDto()
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToList();
        }

        /// <summary>
        /// Get tất cả thuộc tính
        /// </summary>
        /// <returns></returns>
        public List<AttributeDto> GetAll()
        {
            return context.Attributes.Select(x => new AttributeDto()
            {
                Id = x.Id,
                Name = x.Name
            }).ToList();
        }

        /// <summary>
        /// Get thuộc tính theo id
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public AttributeDto GetById(int key)
        {
            return context.Attributes
                 .Where(x => x.Id == key)
                 .Select(x => new AttributeDto()
                 {
                     Id = x.Id,
                     Name = x.Name,
                 }).First();
        }

        /// <summary>
        /// Thêm mới thuộc tính
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public AttributeDto Insert(AttributeDto entity)
        {
            Model.Attribute attribute = new()
            {
                Name = entity.Name!
            };
            context.Attributes.Add(attribute);
            context.SaveChanges();
            return entity;
        }

        /// <summary>
        /// Cập nhật thuộc tính
        /// </summary>
        /// <param name="key"></param>
        /// <param name="entity"></param>
        public void Update(int key, AttributeDto entity)
        {
            Model.Attribute attribute = context.Attributes.First(x => x.Id == key);

            if (attribute != null)
            {
                attribute.Name = entity.Name!;

                context.SaveChanges();
            }
        }
    }
}