using Service.Dto;
using Service.Model;

namespace Service.Service
{
    public class GalleryService(MyContext context, IWebHostEnvironment hostEnvironment) : IServiceBase<GalleryDto, int>
    {
        protected MyContext context = context;
        protected IWebHostEnvironment hostEnvironment = hostEnvironment;

        public void DeleteById(int key)
        {
            context.Galleries.Remove(context.Galleries.First(x => x.Id == key));
            context.SaveChanges();
        }

        public List<GalleryDto> Get(Filter filter)
        {
            return context.Galleries.Select(x => new GalleryDto()
            {
                Id = x.Id,
                Image = x.Image,
                Type = x.Type
            }).ToList();
        }

        public List<GalleryDto> GetAll()
        {
            throw new NotImplementedException();
        }

        public GalleryDto GetById(int key)
        {
            return context.Galleries
                .Where(x => x.Id == key)
                .Select(x => new GalleryDto()
                {
                    Id = x.Id,
                    Image = x.Image,
                    Type = x.Type
                }).First();
        }

        public GalleryDto Insert(GalleryDto entity)
        {
            if (!string.IsNullOrWhiteSpace(entity.Image))
            {
                if (entity.Image.Contains(','))
                {
                    string path = Path.Combine(hostEnvironment.ContentRootPath, $"Resources/Images");
                    string imgName = Guid.NewGuid().ToString("N") + ".png";
                    var bytes = Convert.FromBase64String(entity.Image.Split(',')[1]);
                    using (var imageFile = new FileStream(path + "/" + imgName, FileMode.Create))
                    {
                        imageFile.Write(bytes, 0, bytes.Length);
                        imageFile.Flush();
                    }
                    entity.Image = imgName;
                }

            }

            Gallery gallery = new()
            {
                Image = entity.Image!,
                Type = entity.Type
            };

            context.Galleries.Add(gallery);
            context.SaveChanges();

            return entity;

        }

        public void Update(int key, GalleryDto entity)
        {
            if (!string.IsNullOrWhiteSpace(entity.Image))
            {
                if (entity.Image.Contains(','))
                {
                    string path = Path.Combine(hostEnvironment.ContentRootPath, $"Resources/Images");
                    string imgName = Guid.NewGuid().ToString("N") + ".png";
                    var bytes = Convert.FromBase64String(entity.Image.Split(',')[1]);
                    using (var imageFile = new FileStream(path + "/" + imgName, FileMode.Create))
                    {
                        imageFile.Write(bytes, 0, bytes.Length);
                        imageFile.Flush();
                    }
                    entity.Image = imgName;
                }

            }

            Gallery gallery = context.Galleries.First(x => x.Id == key);
            gallery.Image = entity.Image!;
            gallery.Type = entity.Type;

            context.SaveChanges();
        }
    }
}