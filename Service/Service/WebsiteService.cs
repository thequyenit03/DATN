using Service.Dto;
using Service.Model;

namespace Service.Service
{
    public class WebsiteService(MyContext context, IWebHostEnvironment hostEnvironment) : IServiceBase<WebsiteDto, int>
    {
        protected MyContext context = context;
        protected IWebHostEnvironment hostEnvironment = hostEnvironment;

        public void DeleteById(int key)
        {
            throw new NotImplementedException();
        }

        public List<WebsiteDto> Get(Filter filter)
        {
            return context.Websites.Select(x => new WebsiteDto()
            {
                Address = x.Address,
                Copyright = x.Copyright,
                Email = x.Email,
                Facebook = x.Facebook,
                Fax = x.Fax,
                Id = x.Id,
                Location = x.Location,
                Logo = x.Logo,
                Name = x.Name,
                PhoneNumber = x.PhoneNumber,
                Youtube = x.Youtube
            }).ToList();
        }

        public List<WebsiteDto> GetAll()
        {
            throw new NotImplementedException();
        }

        public WebsiteDto GetById(int key)
        {
            throw new NotImplementedException();
        }

        public WebsiteDto Insert(WebsiteDto entity)
        {
            throw new NotImplementedException();
        }

        public void Update(int key, WebsiteDto entity)
        {
            if (!string.IsNullOrWhiteSpace(entity.Logo))
            {
                if (entity.Logo.Contains(','))
                {
                    string path = Path.Combine(hostEnvironment.ContentRootPath, $"Resources/Images");
                    string imgName = Guid.NewGuid().ToString("N") + ".png";
                    var bytes = Convert.FromBase64String(entity.Logo.Split(',')[1]);
                    using (var imageFile = new FileStream(path + "/" + imgName, FileMode.Create))
                    {
                        imageFile.Write(bytes, 0, bytes.Length);
                        imageFile.Flush();
                    }
                    entity.Logo = imgName;
                }

            }

            Website website = context.Websites.First(x => x.Id == key);

            website.Address = entity.Address!;
            website.Copyright = entity.Copyright!;
            website.Email = entity.Email!;
            website.Facebook = entity.Facebook!;
            website.Fax = entity.Fax!;
            website.Location = entity.Location!;
            website.Logo = entity.Logo!;
            website.Name = entity.Name!;
            website.PhoneNumber = entity.PhoneNumber!;
            website.Youtube = entity.Youtube!;

            context.SaveChanges();
        }
    }
}
