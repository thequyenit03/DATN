using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Service.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AnyCors",
       builder => builder
           .AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader());
});


#region jwt
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
#endregion

#region EFCore
builder.Services.AddDbContext<MyContext>(option => option.UseLazyLoadingProxies()
	.UseSqlServer(builder.Configuration.GetConnectionString("ConnectionString"), sqlServerOptions => sqlServerOptions.CommandTimeout(60)));
#endregion

builder.Services.AddScoped<ArticleService>();
builder.Services.AddScoped<AttributeService>();
builder.Services.AddScoped<CustomerService>();
builder.Services.AddScoped<EmailConfigurationService>();
builder.Services.AddScoped<EmailRegistrationService>();
builder.Services.AddScoped<EmailTemplateService>();
builder.Services.AddScoped<GalleryService>();
builder.Services.AddScoped<MenuService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<ProviderService>();
builder.Services.AddScoped<ReportService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<WebsiteService>();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors("AnyCors");

app.UseAuthorization();

app.MapControllers();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "Resources")),
    RequestPath = "/resources"
});

app.Run();
