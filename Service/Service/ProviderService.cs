using Service.Dto;
using Service.Model;

namespace Service.Service
{
    public class ProviderService(MyContext context) : IServiceBase<ProviderDto, string>
    {
        protected MyContext context = context;

        public virtual void DeleteById(string key)
        {
            if (context.Products.Any(x => x.ProviderCode == key))
            {
                throw new ArgumentException("Nhà cung cấp đang sử dụng trong thông tin sản phẩm");
            }
            Provider provider = context.Providers.First(x => x.Code == key);

            context.Providers.Remove(provider);

            context.SaveChanges();
        }

        /// <summary>
        /// Get danh sách nhà cung cấp theo từ khóa
        /// </summary>
        /// <param name="keySearch"></param>
        /// <returns></returns>
        public List<ProviderDto> Get(Filter filter)
        {
            IQueryable<Provider> query = context.Providers;

            if (!string.IsNullOrWhiteSpace(filter.keySearch))
            {
                query = query.Where(x => x.Name.Contains(filter.keySearch));
            }

            return query
                .OrderBy(x => x.Name)
                .Select(x => new ProviderDto()
                {
                    Code = x.Code,
                    Address = x.Address,
                    Email = x.Email,
                    Name = x.Name,
                    PhoneNumber = x.PhoneNumber
                })
                .ToList();
        }

        public virtual List<ProviderDto> GetAll()
        {
            return context.Providers
                .OrderBy(x => x.Name)
                .Select(x => new ProviderDto()
                {
                    Code = x.Code,
                    Name = x.Name,
                })
                .ToList();
        }

        /// <summary>
        /// Get thông tin nhà cung cấp theo id
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public virtual ProviderDto GetById(string key)
        {
            return context.Providers
                  .Where(x => x.Code == key)
                  .Select(x => new ProviderDto()
                  {
                      Code = x.Code,
                      Address = x.Address,
                      Email = x.Email,
                      Name = x.Name,
                      PhoneNumber = x.PhoneNumber
                  })
                  .First();
        }

        /// <summary>
        /// Thêm mới tài khoản nhà cung cấp
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public virtual ProviderDto Insert(ProviderDto entity)
        {
            Provider provider = new()
            {
                Code = Guid.NewGuid().ToString("N"),
                Name = entity.Name!,
                PhoneNumber = entity.PhoneNumber!,
                Email = entity.Email!,
                Address = entity.Address!
            };

            context.Providers.Add(provider);
            context.SaveChanges();

            return entity;
        }

        /// <summary>
        /// Cập nhật thông tin nhà cung cấp
        /// </summary>
        /// <param name="key"></param>
        /// <param name="entity"></param>
        public virtual void Update(string key, ProviderDto entity)
        {
            Provider provider = context.Providers
                .First(x => x.Code == key);

            if (provider != null)
            {
                provider.Name = entity.Name!;
                provider.Email = entity.Email!;
                provider.PhoneNumber = entity.PhoneNumber!;
                provider.Address = entity.Address!;

                context.SaveChanges();
            }
        }
    }
}