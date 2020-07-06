using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Security;
using Westmoor.DowntimePlanner.Services;

namespace Westmoor.DowntimePlanner
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IApiKeyRepository, ApiKeyRepository>();
            services.AddSingleton<IApiKeyService, ApiKeyService>();
            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = ApiKeyAuthenticationOptions.DefaultScheme;
                    options.DefaultChallengeScheme = ApiKeyAuthenticationOptions.DefaultScheme;
                })
                .AddApiKeySupport();
            services.AddAuthorization(options =>
            {
                foreach (var (name, role) in Policies.All)
                {
                    options.AddPolicy(name, b => b.RequireRole(role));
                }
            });

            services.AddScoped<IActivityRepository, ActivityRepository>();
            services.AddScoped<ICharacterRepository, CharacterRepository>();
            services.AddScoped<IDowntimeRepository, DowntimeRepository>();

            services.AddScoped<IActivityService, ActivityService>();
            services.AddScoped<ICharacterService, CharacterService>();
            services.AddScoped<IDowntimeService, DowntimeService>();

            services.AddControllersWithViews();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });

            services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("apiKey", new OpenApiSecurityScheme
                {
                    Description = "Api key provided by the API. Will be passed in the X-Api-Key HTTP header.",
                    In = ParameterLocation.Header,
                    Name = "X-Api-Key",
                    Type = SecuritySchemeType.ApiKey
                });
                options.OperationFilter<SecurityRequirementsOperationFilter>();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Westmoor Downtime API v1");
            });

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
