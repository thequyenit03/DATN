using Service.Dto;
using Service.Model;

namespace Service.Service
{
    public class ArticleService(MyContext context, IWebHostEnvironment hostEnvironment) : IServiceBase<ArticleDto, int>
    {
        protected MyContext context = context;
        protected IWebHostEnvironment hostEnvironment = hostEnvironment;

        /// <summary>
        /// Xóa bài viết
        /// </summary>
        /// <param name="key"></param>
        /// <param name="userSession"></param>
        public void DeleteById(int key)
        {
            Article article = context.Articles.First(x => x.Id == key);

            if (article != null)
            {
                context.Articles.Remove(article);
                context.SaveChanges();
            }
        }

        /// <summary>
        /// Get bài viết theo từ khóa
        /// </summary>
        /// <param name="keySearch"></param>
        /// <returns></returns>
        public List<ArticleDto> Get(Filter filter)
        {
            IQueryable<Article> query = context.Articles;

            if (!string.IsNullOrWhiteSpace(filter.keySearch))
            {
                query = query.Where(x => x.Title!.Contains(filter.keySearch) || x.Menu!.Name.Contains(filter.keySearch));
            }

            return query
                .OrderBy(x => x.Index)
                .Select(x => new ArticleDto()
                {
                    Id = x.Id,
                    Title = x.Title,
                    Alias = x.Alias,
                    MenuId = x.MenuId,
                    Index = x.Index,
                    Active = x.Active,
                    Image = x.Image,
                    Menu = new MenuDto()
                    {
                        Name = x.Menu!.Name
                    },
                    Created = x.Created
                })
                .ToList();
        }

        /// <summary>
        /// Get tất cả bài viết
        /// </summary>
        /// <returns></returns>
        public List<ArticleDto> GetAll()
        {
            return context.Articles
                .Select(x => new ArticleDto()
                {
                    Id = x.Id,
                    Title = x.Title,
                    Alias = x.Alias
                })
                .ToList();
        }

        /// <summary>
        /// Get các bài viết nỗi bật để hiển thị trên trang chủ
        /// </summary>
        /// <returns></returns>
        public List<ArticleDto> GetHighlight()
        {
            return context.Articles
                .Where(x => x.Active)
                .Where(x => x.Menu!.Type == "bai-viet")
                .OrderBy(x => x.Index)
                .Select(x => new ArticleDto()
                {
                    Title = x.Title,
                    Alias = x.Alias,
                    Image = x.Image
                })
                .Take(5)
                .ToList();
        }

        /// <summary>
        /// Get bài viết theo alias của menu
        /// </summary>
        /// <param name="menuAlias">Alias của menu</param>
        /// <param name="take">Số lượng bài viết</param>
        /// <returns></returns>
        public MenuDto GetByMenu(string menuAlias, int take = 30)
        {
            MenuDto menu = context.Menus
                   .Where(x => x.Alias == menuAlias)
                   .Select(x => new MenuDto()
                   {
                       Id = x.Id,
                       Name = x.Name,
                       Alias = x.Alias
                   }).First();

            menu.Articles = context.Articles
                .Where(x => x.Active)
                .Where(x => x.Menu!.Alias == menuAlias)
                .OrderBy(x => x.Index)
                .Select(x => new ArticleDto()
                {
                    Title = x.Title,
                    Alias = x.Alias,
                    Image = x.Image
                })
                .Take(take)
                .ToList();

            return menu;
        }

        /// <summary>
        /// Get bài viết theo id
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public ArticleDto GetById(int key)
        {
            return context.Articles
                .Where(x => x.Id == key)
               .Select(x => new ArticleDto()
               {
                   Id = x.Id,
                   Title = x.Title,
                   Alias = x.Alias,
                   Active = x.Active,
                   ShortDescription = x.ShortDescription,
                   Description = x.Description,
                   Created = x.Created,
                   Image = x.Image,
                   Index = x.Index,
                   MenuId = x.MenuId
               })
               .First();
        }

        /// <summary>
        /// Get bài viết theo alias
        /// </summary>
        /// <param name="alias"></param>
        /// <returns></returns>
        public ArticleDto GetByAlias(string alias)
        {
            return context.Articles
               .Where(x => x.Alias == alias)
               .Select(x => new ArticleDto()
               {
                   Menu = new MenuDto()
                   {
                       Alias = x.Menu!.Alias
                   },
                   Title = x.Title,
                   Alias = x.Alias,
                   ShortDescription = x.ShortDescription,
                   Description = x.Description,
                   Image = x.Image,
                   Created = x.Created
               })
               .First();
        }

        /// <summary>
        /// Thêm mới bài viết
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public ArticleDto Insert(ArticleDto entity)
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
            Article article = new()
            {
                Active = entity.Active,
                Alias = "",
                Created = DateTime.Now,
                Description = entity.Description,
                Image = entity.Image,
                Index = entity.Index,
                MenuId = entity.MenuId,
                ShortDescription = entity.ShortDescription,
                Title = entity.Title,
            };

            context.Articles.Add(article);
            context.SaveChanges();
            article.Alias = entity.Alias + "-" + article.Id;

            context.SaveChanges();
            return entity;
        }

        /// <summary>
        /// Cập nhật bài viết
        /// </summary>
        /// <param name="key"></param>
        /// <param name="entity"></param>
        public void Update(int key, ArticleDto entity)
        {
            Article article = context.Articles
                .First(x => x.Id == key);

            if (article != null)
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

                article.Title = entity.Title;

                if (article.Alias != entity.Alias)
                    article.Alias = entity.Alias + "-" + entity.Id;

                article.Active = entity.Active;
                article.ShortDescription = entity.ShortDescription;
                article.Description = entity.Description;
                article.Image = entity.Image;
                article.Index = entity.Index;
                article.MenuId = entity.MenuId;

                context.SaveChanges();
            }
        }
    }
}
