using Service.Dto;
using Service.Model;

namespace Service.Service
{
    public class EmailConfigurationService(MyContext context)
    {
        protected MyContext context = context;

        /// <summary>
        /// Get cấu hình tài khoản gửi mail
        /// </summary>
        /// <returns></returns>
        public EmailConfigurationDto Get()
        {
            return context.EmailConfigurations
                 .Select(x => new EmailConfigurationDto()
                 {
                     Id = x.Id,
                     Email = x.Email,
                     Password = x.Password
                 })
                 .First();
        }

        /// <summary>
        /// Cập nhật tài khoản gửi mail
        /// </summary>
        /// <param name="key"></param>
        /// <param name="entity"></param>
        public void Update(int key, EmailConfigurationDto entity)
        {
            EmailConfiguration emailConfiguration = context.EmailConfigurations
                 .First(x => x.Id == key);

            emailConfiguration.Email = entity.Email!;
            emailConfiguration.Password = entity.Password!;

            context.SaveChanges();
        }
    }
}