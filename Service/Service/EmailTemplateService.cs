using Service.Dto;
using Service.Model;

namespace Service.Service
{
    public class EmailTemplateService(MyContext context) : IServiceBase<EmailTemplateDto, int>
    {
        protected MyContext context = context;

        public virtual void DeleteById(int key)
        {
            throw new NotImplementedException();
        }

        public List<EmailTemplateDto> Get(Filter filter)
        {
            return context.EmailTemplates
                 .Select(x => new EmailTemplateDto()
                 {
                     Id = x.Id,
                     Subject = x.Subject,
                     Type = x.Type
                 })
                 .ToList();
        }

        public virtual List<EmailTemplateDto> GetAll()
        {
            throw new NotImplementedException();
        }

        public virtual EmailTemplateDto GetById(int key)
        {
            return context.EmailTemplates
                 .Where(x => x.Id == key)
                 .Select(x => new EmailTemplateDto()
                 {
                     Content = x.Content,
                     BCC = x.BCC,
                     CC = x.CC,
                     Id = x.Id,
                     KeyGuide = x.KeyGuide,
                     Subject = x.Subject,
                     Type = x.Type
                 })
                 .First();
        }

        public virtual EmailTemplateDto Insert(EmailTemplateDto entity)
        {
            throw new NotImplementedException();
        }

        public virtual void Update(int key, EmailTemplateDto entity)
        {
            EmailTemplate emailTemplate = context.EmailTemplates
                 .First(x => x.Id == key);

            emailTemplate.Subject = entity.Subject;
            emailTemplate.CC = entity.CC;
            emailTemplate.BCC = entity.BCC;
            emailTemplate.Content = entity.Content!;

            context.SaveChanges();
        }
    }
}