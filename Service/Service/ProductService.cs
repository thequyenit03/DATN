using Service.Dto;
using Service.Model;
using Service.Util;

namespace Service.Service
{
    public class ProductService(MyContext context, IWebHostEnvironment hostEnvironment) : IServiceBase<ProductDto, int>
    {
        protected MyContext context = context;
        protected IWebHostEnvironment hostEnvironment = hostEnvironment;

        public void DeleteById(int key)
        {
            Product product = context.Products.First(x => x.Id == key);

            context.ProductAttributes.RemoveRange(product.ProductAttributes!);
            context.ProductImages.RemoveRange(product.ProductImages!);
            context.ProductRelateds.RemoveRange(product.ProductRelateds!);
            context.Reviews.RemoveRange(product.Reviews!);
            context.Products.Remove(product);

            context.SaveChanges();
        }

        public List<ProductDto> Get(Filter filter)
        {
            var query = context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.keySearch))
                query = query.Where(x => x.Name.ToString().Contains(filter.keySearch));

            if (filter.menuId.HasValue)
                query = query.Where(x => x.MenuId == filter.menuId);

            return query
                .OrderBy(x => x.Menu!.Index)
                .ThenBy(x => x.Index)
                .Select(x => new ProductDto()
                {
                    Id = x.Id,
                    Alias = x.Alias,
                    DiscountPrice = x.DiscountPrice,
                    Selling = x.Selling,
                    Image = x.Image,
                    Index = x.Index,
                    MenuId = x.MenuId,
                    Price = x.Price,
                    Name = x.Name,
                    Status = x.Status,
                    Qty = x.Qty,
                    MenuName = x.Menu!.Name,
                    ProviderName = x.Provider!.Name
                })
                .ToList();
        }

        public List<ProductDto> GetAll()
        {
            return context.Products
                .Select(x => new ProductDto()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Image = x.Image,
                    Qty = x.Qty,
                })
                .ToList();
        }

        /// <summary>
        /// Get danh sách sản phẩm bán chạy hiển thị trên trang homepage
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public List<ProductDto> GetProductSelling(string? userSession, int number = 10)
        {
            List<ProductDto> products = context.Products
                .Where(x => x.Status == 10)
                .Where(x => x.Selling == true)
                .OrderBy(x => x.Index)
                .Select(x => new ProductDto()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Image = x.Image,
                    Price = x.Price,
                    DiscountPrice = x.DiscountPrice,
                    Alias = x.Alias,
                    ProductAttributes = x.ProductAttributes!.Select(y => new ProductAttributeDto()
                    {
                        Attribute = new AttributeDto()
                        {
                            Id = y.Attribute!.Id,
                            Name = y.Attribute.Name
                        },
                        AttributeId = y.AttributeId,
                        Value = y.Value
                    }).ToList(),
                    Qty = x.Qty,
                })
                .Take(number)
                .ToList();

            RestructureAttribute(context, userSession, products);

            return products;
        }

        public List<ProductDto> Search(Filter filter)
        {
            var query = context.Products
                .Where(x => x.Status == 10);

            if (!string.IsNullOrWhiteSpace(filter.keySearch))
            {
                query = query.Where(x => x.Name.Contains(filter.keySearch));
            }

            if (!string.IsNullOrWhiteSpace(filter.orderBy))
            {
                switch (filter.orderBy)
                {
                    case "highlight":
                        break;
                    case "price-asc":
                        query = query.OrderBy(x => x.DiscountPrice);
                        break;
                    case "price-desc":
                        query = query.OrderByDescending(x => x.DiscountPrice);
                        break;
                }
            }
            if (!string.IsNullOrWhiteSpace(filter.price))
            {
                switch (filter.price)
                {
                    case "m30":
                        query = query.Where(x => x.DiscountPrice >= 30000000);
                        break;
                    case "f20t30":
                        query = query.Where(x => x.DiscountPrice >= 20000000 && x.DiscountPrice < 30000000);
                        break;
                    case "f10t20":
                        query = query.Where(x => x.DiscountPrice >= 10000000 && x.DiscountPrice < 20000000);
                        break;
                    case "f5t10":
                        query = query.Where(x => x.DiscountPrice >= 5000000 && x.DiscountPrice < 10000000);
                        break;
                    case "l5":
                        query = query.Where(x => x.DiscountPrice < 5000000);
                        break;
                }
            }

            return query
                .Select(x => new ProductDto()
                {
                    Alias = x.Alias,
                    DiscountPrice = x.DiscountPrice,
                    Image = x.Image,
                    Price = x.Price,
                    Name = x.Name,
                    Qty = x.Qty,
                })
                .Take(filter.take ?? 30)
                .ToList();
        }

        /// <summary>
        /// Get danh sách sản phẩm theo alias của danh mục menu
        /// </summary>
        /// <param name="menuAlias"></param>
        /// <param name="orderBy"></param>
        /// <param name="price"></param>
        /// <param name="take"></param>
        /// <returns></returns>
        public MenuDto GetByMenu(string? userSession, Filter filter)
        {
            MenuDto menu = context.Menus
                .Where(x => x.Alias == filter.menuAlias)
                .Select(x => new MenuDto()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Alias = x.Alias
                }).First();

            var query = context.Products
                .Where(x => x.Status == 10 && x.MenuId == menu.Id);

            if (!string.IsNullOrWhiteSpace(filter.orderBy))
            {
                switch (filter.orderBy)
                {
                    case "highlight":
                        break;
                    case "price-asc":
                        query = query.OrderBy(x => x.DiscountPrice);
                        break;
                    case "price-desc":
                        query = query.OrderByDescending(x => x.DiscountPrice);
                        break;
                }
            }
            if (!string.IsNullOrWhiteSpace(filter.price))
            {
                switch (filter.price)
                {
                    case "m30":
                        query = query.Where(x => x.DiscountPrice >= 30000000);
                        break;
                    case "f20t30":
                        query = query.Where(x => x.DiscountPrice >= 20000000 && x.DiscountPrice < 30000000);
                        break;
                    case "f10t20":
                        query = query.Where(x => x.DiscountPrice >= 10000000 && x.DiscountPrice < 20000000);
                        break;
                    case "f5t10":
                        query = query.Where(x => x.DiscountPrice >= 5000000 && x.DiscountPrice < 10000000);
                        break;
                    case "l5":
                        query = query.Where(x => x.DiscountPrice < 5000000);
                        break;
                    default:
                        break;
                }
            }

            List<ProductDto> products = query
                .Select(x => new ProductDto()
                {
                    Id = x.Id,
                    Alias = x.Alias,
                    DiscountPrice = x.DiscountPrice,
                    Image = x.Image,
                    Price = x.Price,
                    Name = x.Name,
                    Qty = x.Qty,
                    ProductAttributes = x.ProductAttributes!.Select(y => new ProductAttributeDto()
                    {
                        Attribute = new AttributeDto()
                        {
                            Id = y.Attribute!.Id,
                            Name = y.Attribute.Name
                        },
                        AttributeId = y.AttributeId,
                        Value = y.Value
                    }).ToList(),
                })
                .Take(filter.take ?? 30)
                .ToList();

            RestructureAttribute(context, userSession, products);

            menu.Products = products;
            return menu;
        }

        public ProductDto GetById(int key)
        {
            ProductDto product = context.Products
                 .Where(x => x.Id == key)
                 .Select(x => new ProductDto()
                 {
                     Id = x.Id,
                     Alias = x.Alias,
                     Description = x.Description,
                     DiscountPrice = x.DiscountPrice,
                     Selling = x.Selling,
                     Image = x.Image,
                     Index = x.Index,
                     MenuId = x.MenuId,
                     Price = x.Price,
                     Name = x.Name,
                     ShortDescription = x.ShortDescription,
                     Status = x.Status,
                     ProductAttributes = x.ProductAttributes!.Select(y => new ProductAttributeDto()
                     {
                         AttributeId = y.AttributeId,
                         Value = y.Value
                     }).ToList(),
                     ProductRelateds = x.ProductRelateds!.Select(y => new ProductRelatedDto()
                     {
                         ProductRelatedId = y.ProductRelatedId
                     }).ToList(),
                     ProductImages = x.ProductImages!.Select(y => new ProductImageDto()
                     {
                         Image = y.Image
                     }).ToList(),
                     ProviderCode = x.ProviderCode,
                     Qty = x.Qty
                 })
                 .First();

            //product.IsWishlist = context.CustomerWishLists
            //    .Where(x => x.CustomerCode == userSession)
            //    .Any(x => x.ProductId == product.Id);

            return product;
        }

        public ProductDto GetByAlias(string? userSession, string alias)
        {
            ProductDto product = context.Products
                .Where(x => x.Alias == alias)
                .Select(x => new ProductDto()
                {
                    Id = x.Id,
                    Alias = x.Alias,
                    Description = x.Description,
                    DiscountPrice = x.DiscountPrice,
                    Selling = x.Selling,
                    Image = x.Image,
                    Index = x.Index,
                    MenuId = x.MenuId,
                    Price = x.Price,
                    Name = x.Name,
                    ShortDescription = x.ShortDescription,
                    Status = x.Status,
                    ProviderName = x.Provider!.Name,
                    Qty = x.Qty,
                    MenuName = x.Name,
                    ProductAttributes = x.ProductAttributes!.Select(y => new ProductAttributeDto()
                    {
                        Attribute = new AttributeDto()
                        {
                            Id = y.Attribute!.Id,
                            Name = y.Attribute.Name
                        },
                        AttributeId = y.AttributeId,
                        Value = y.Value
                    }).ToList(),
                    ProductRelateds = x.ProductRelateds!.Select(y => new ProductRelatedDto()
                    {
                        ProductRelatedId = y.ProductRelatedId
                    })
                    .Take(5)
                    .ToList(),
                    ProductImages = x.ProductImages!.Select(y => new ProductImageDto()
                    {
                        Image = y.Image
                    }).ToList(),
                    Reviews = x.Reviews!.OrderByDescending(y => y.Created)
                        .Where(y => y.Status == Constants.ReviewStatus.DA_DUYET).Select(y => new ReviewDto()
                        {
                            Content = y.Content,
                            Created = y.Created,
                            CreatedBy = y.CreatedBy,
                            Status = y.Status,
                            Star = y.Star,
                        }).ToList()
                })
                .First();

            RestructureAttribute(context, userSession, [product]);

            product.ProductRelateds!.ForEach(x =>
            {
                x.Product = context.Products.Where(y => y.Id == x.ProductRelatedId)
                    .Select(y => new ProductDto()
                    {
                        Id = y.Id,
                        Name = y.Name,
                        Alias = y.Alias,
                        Image = y.Image,
                        Price = y.Price,
                        DiscountPrice = y.DiscountPrice
                    }).First();
            });
            if (product.Reviews!.Count > 0)
            {
                product.RateAvg = Math.Round((double)product.Reviews!.Sum(x => x.Star ?? 0) / product.Reviews.Count, 1);
            }
            return product;
        }

        public ProductDto Insert(ProductDto entity)
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

            Product product = new()
            {
                Price = entity.Price,
                Name = entity.Name!,
                MenuId = entity.MenuId!.Value,
                Index = entity.Index,
                Image = entity.Image,
                DiscountPrice = entity.DiscountPrice,
                Selling = entity.Selling,
                Description = entity.Description,
                Alias = "",
                ShortDescription = entity.ShortDescription,
                Status = entity.Status,
                ProviderCode = entity.ProviderCode,
                Qty = entity.Qty!.Value,
            };

            if (entity.ProductImages != null && entity.ProductImages.Count > 0)
            {
                List<ProductImage> productImages = [];

                foreach (var item in entity.ProductImages)
                {
                    if (!string.IsNullOrWhiteSpace(item.Image))
                    {
                        if (item.Image.Contains(','))
                        {
                            string path = Path.Combine(hostEnvironment.ContentRootPath, $"Resources/Images");
                            string imgName = Guid.NewGuid().ToString("N") + ".png";
                            var bytes = Convert.FromBase64String(item.Image.Split(',')[1]);
                            using (var imageFile = new FileStream(path + "/" + imgName, FileMode.Create))
                            {
                                imageFile.Write(bytes, 0, bytes.Length);
                                imageFile.Flush();
                            }

                            item.Image = imgName;
                        }
                        productImages.Add(new ProductImage()
                        {
                            Image = item.Image
                        });
                    }
                }

                product.ProductImages = productImages;
            }
            if (entity.ProductAttributes != null && entity.ProductAttributes.Count > 0)
            {
                product.ProductAttributes = entity.ProductAttributes.Select(x => new ProductAttribute()
                {
                    AttributeId = x.AttributeId!.Value,
                    Value = x.Value!
                }).ToList();
            }
            if (entity.ProductRelateds != null && entity.ProductRelateds.Count > 0)
            {
                product.ProductRelateds = entity.ProductRelateds.Select(x => new ProductRelated()
                {
                    ProductRelatedId = x.ProductRelatedId,
                }).ToList();
            }

            context.Products.Add(product);
            context.SaveChanges();
            product.Alias = entity.Alias + "-" + product.Id;

            context.SaveChanges();

            return entity;
        }

        public void Update(int key, ProductDto entity)
        {
            using var transaction = context.Database.BeginTransaction();
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

            Product product = context.Products.First(x => x.Id == key);

            product.MenuId = entity.MenuId!.Value;
            product.Name = entity.Name!;
            product.ProviderCode = entity.ProviderCode;
            product.Qty = entity.Qty!.Value;

            if (product.Alias != entity.Alias)
                product.Alias = entity.Alias + "-" + key;
            product.Image = entity.Image;
            product.Index = entity.Index;
            product.Status = entity.Status;
            product.Price = entity.Price;
            product.DiscountPrice = entity.DiscountPrice;
            product.Selling = entity.Selling;
            product.ShortDescription = entity.ShortDescription;
            product.Description = entity.Description;

            context.ProductAttributes.RemoveRange(product.ProductAttributes!);
            context.ProductImages.RemoveRange(product.ProductImages!);
            context.ProductRelateds.RemoveRange(product.ProductRelateds!);

            if (entity.ProductAttributes != null && entity.ProductAttributes.Count > 0)
            {
                context.ProductAttributes.AddRange(entity.ProductAttributes.Select(x => new ProductAttribute()
                {
                    AttributeId = x.AttributeId!.Value,
                    ProductId = key,
                    Value = x.Value!
                }));
            }

            if (entity.ProductImages != null && entity.ProductImages.Count > 0)
            {
                List<ProductImage> productImages = [];

                foreach (var item in entity.ProductImages)
                {
                    if (!string.IsNullOrWhiteSpace(item.Image))
                    {
                        if (item.Image.Contains(','))
                        {
                            string path = Path.Combine(hostEnvironment.ContentRootPath, $"Resources/Images");
                            string imgName = Guid.NewGuid().ToString("N") + ".png";
                            var bytes = Convert.FromBase64String(item.Image.Split(',')[1]);
                            using (var imageFile = new FileStream(path + "/" + imgName, FileMode.Create))
                            {
                                imageFile.Write(bytes, 0, bytes.Length);
                                imageFile.Flush();
                            }

                            item.Image = imgName;
                        }
                        productImages.Add(new ProductImage()
                        {
                            ProductId = key,
                            Image = item.Image
                        });
                    }
                }

                context.ProductImages.AddRange(productImages);
            }

            if (entity.ProductRelateds != null && entity.ProductRelateds.Count > 0)
            {
                context.ProductRelateds.AddRange(entity.ProductRelateds.Select(x => new ProductRelated()
                {
                    ProductId = key,
                    ProductRelatedId = x.ProductRelatedId
                }));
            }

            context.SaveChanges();
            transaction.Commit();
        }

        /// <summary>
        /// Cấu trúc lại thông tin thuộc tính của model sản phẩm
        /// </summary>
        /// <param name="products"></param>
        public static void RestructureAttribute(MyContext context, string? userSession, List<ProductDto> products)
        {
            List<int> productWishlistIds = string.IsNullOrWhiteSpace(userSession) ? [] : context.CustomerWishLists
                .Where(x => x.CustomerCode == userSession)
                .Select(x => x.ProductId)
                .ToList();

            foreach (var product in products)
            {
                product.IsWishlist = productWishlistIds.Any(x => x == product.Id);

                product.Attributes = product.ProductAttributes!.Select(x => new AttributeDto()
                {
                    Name = x.Attribute!.Name,
                    Id = x.Attribute.Id
                }).Distinct().ToList();

                product.Attributes.ForEach(x =>
                {
                    x.ProductAttributes = product.ProductAttributes!
                        .Where(y => y.AttributeId == x.Id)
                        .Select(y => y.Value)
                        .First()?.Split(',')
                        .Select(y => new ProductAttributeDto()
                        {
                            Value = y,
                        }).ToList() ?? [];
                });
                product.ProductAttributes = null;
            }
            ;
        }
    }
}
