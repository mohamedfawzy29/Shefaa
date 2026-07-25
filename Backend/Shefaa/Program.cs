using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Shefaa.Configurations;
using Shefaa.Data;
using Shefaa.Repositories;
using Shefaa.Services;
using Shefaa.Utilites.DBseeding;
using Stripe;
using System.Text;

namespace Shefaa
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            // Add services to the container.

            builder.Services.AddControllers();

            var connectionString =
               builder.Configuration.GetConnectionString("DefaultConnection")
                   ?? throw new InvalidOperationException("Connection string"
                   + "'DefaultConnection' not found.");


            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(connectionString);
            });
            builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = true;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            // AppConfiguration.RegisterConfig(builder.Services); 
            // builder.Services.RegisterConfig();

            builder.Services.ConfigureApplicationCookie(options =>
            {
                options.LoginPath = "/Identity/Account/Login";
                options.AccessDeniedPath = "/Identity/Account/AccessDenied";
            });

            StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

            // Single source of truth for allowed origins.
            // Referenced by both the CORS policy below and the manual header inside
            // UseExceptionHandler (which doesn't invoke UseCors on its branch pipeline).
            // To add a new origin, add it here only — nowhere else.
            string[] allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Frontend", policy =>
                {
                    policy
                        .WithOrigins(allowedOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();


            var jwtSettings = builder.Configuration.GetSection("JwtSettings");
            builder.Services.AddAuthentication(opt => {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = jwtSettings["validIssuer"],
                    ValidAudience = jwtSettings["validAudience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["securityKey"]))
                };
            });

            builder.Services.AddScoped<IDbInitializer, DbInitializer>();
            builder.Services.AddScoped<IDummyDataSeeder, DummyDataSeeder>();
            builder.Services.AddScoped<IEmailSender, EmailSender>();
            builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            builder.Services.AddScoped<IFileService, Services.FileService>();
            builder.Services.AddScoped<IJwtHandler, JwtHandler>();
            builder.Services.AddScoped<IApplicationUserService, Services.ApplicationUserService>();
            builder.Services.AddScoped<IDoctorService, DoctorService>(); // Phase 1 prerequisite — was missing, caused runtime DI crash on Admin/ReviewController

            MapsterConfig.RegisterMappings();

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var dbInitializer = scope.ServiceProvider.GetRequiredService<IDbInitializer>();
                await dbInitializer.InitializeAsync();
            }

            // ── Global exception handler ──────────────────────────────────────────────
            // Must be first in the pipeline so it catches exceptions from every subsequent
            // middleware and controller, including Repository rethrowing (Phase 2).
            // Returns a unified ApiResponse<object> JSON 500 instead of an empty response.
            app.UseExceptionHandler(errorPipeline =>
            {
                errorPipeline.Run(async context =>
                {
                    var logger = context.RequestServices
                        .GetRequiredService<ILogger<Program>>();

                    var exceptionFeature = context.Features
                        .Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();

                    if (exceptionFeature is not null)
                    {
                        logger.LogError(
                            exceptionFeature.Error,
                            "Unhandled exception on {Method} {Path} — {ExceptionType}: {ExceptionMessage}",
                            context.Request.Method,
                            context.Request.Path,
                            exceptionFeature.Error.GetType().Name,
                            exceptionFeature.Error.Message);
                    }

                    // UseExceptionHandler's branch pipeline does not invoke UseCors,
                    // so CORS headers must be set manually here.
                    // Only set the header on an exact match against our allowed list —
                    // never reflect an unknown origin and never fall back to wildcard.
                    // Note: Contains is case-sensitive by design (all current origins are
                    // lowercase localhost). Use StringComparer.OrdinalIgnoreCase if prod
                    // domains are ever added.
                    var requestOrigin = context.Request.Headers.Origin.FirstOrDefault();
                    if (requestOrigin is not null && allowedOrigins.Contains(requestOrigin))
                    {
                        context.Response.Headers.Append("Access-Control-Allow-Origin", requestOrigin);
                    }

                    context.Response.StatusCode  = StatusCodes.Status500InternalServerError;
                    context.Response.ContentType = "application/json";

                    await context.Response.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message   = "An unexpected error occurred."
                    });
                });
            });
            // ─────────────────────────────────────────────────────────────────────────

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            app.UseHttpsRedirection();
            app.UseCors("Frontend");
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}