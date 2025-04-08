using Service.Dto;
using Service.Model;

namespace Service.Service
{
    public class EmailRegistrationService(MyContext context)
    {
        protected MyContext context = context;

        /// <summary>
        /// Get danh sách email đăng ký nhận tin
        /// </summary>
        /// <param name="keySearch"></param>
        /// <returns></returns>
        public List<EmailRegistrationDto> Get(Filter filter)
        {
            IQueryable<EmailRegistration> query = context.EmailRegistrations;

            if (!string.IsNullOrWhiteSpace(filter.keySearch))
            {
                query = query.Where(x => x.Email.Contains(filter.keySearch));
            }

            return query
                 .Select(x => new EmailRegistrationDto()
                 {
                     Id = x.Id,
                     Email = x.Email,
                     Created = x.Created
                 })
                 .ToList();
        }

        /// <summary>
        /// Thêm mới email nhận tin
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public EmailRegistrationDto Insert(EmailRegistrationDto entity)
        {
            if (!context.EmailRegistrations.Any(x => x.Email == entity.Email))
            {
                context.EmailRegistrations.Add(new Model.EmailRegistration()
                {
                    Email = entity.Email!,
                    Created = DateTime.Now
                });

                context.SaveChanges();
            }
            return entity;
        }
    }
}