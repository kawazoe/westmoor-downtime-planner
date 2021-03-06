using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
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
            services.AddSingleton<IClock, SystemClock>();
            services.AddSingleton<IUuidFactory, GuidUuidFactory>();
            services.AddHttpContextAccessor();

            services.AddSingleton(p => new CosmosClient(
                Configuration["CosmosConnectionString"],
                new CosmosClientOptions
                {
                    ConnectionMode = ConnectionMode.Gateway,
                    SerializerOptions = new CosmosSerializationOptions
                    {
                        PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                    }
                }
            ));
            services.AddSingleton(async p =>
            {
                var database = p.GetRequiredService<CosmosClient>().GetDatabase(Configuration["CosmosDatabase"]);
                await database.ReadAsync();
                return database;
            });
            services.AddSingleton(async p =>
            {
                var database = await p.GetRequiredService<Task<Database>>();
                var container = database.GetContainer(Configuration["CosmosContainer"]);
                await container.ReadContainerAsync();
                return container;
            });
            services.AddScoped(typeof(IShareWithFactory), typeof(ShareWithFactory));
            services.AddScoped(typeof(ICosmosEntityFilter<>), typeof(AspNetCoreCosmosEntityFilter<>));
            services.AddScoped(typeof(ICosmosEntityMutator<>), typeof(AspNetCoreCosmosEntityMutator<>));

            services.Configure<OAuthTokenStore.Options>(Configuration.GetSection("auth0"));
            services.AddHttpClient<IAuth0ApiUserReadRepository, Auth0ApiUserReadRepository>((s, c) =>
                {
                    c.BaseAddress = new Uri(
                        s.GetRequiredService<IOptions<OAuthTokenStore.Options>>().Value.EndpointUrl
                    );
                })
                .AddOAuthTokens();
            services.AddHttpClient<IAuth0ApiUserWriteRepository, Auth0ApiUserWriteRepository>((s, c) =>
                {
                    c.BaseAddress = new Uri(
                        s.GetRequiredService<IOptions<OAuthTokenStore.Options>>().Value.EndpointUrl
                    );
                })
                .AddOAuthTokens();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IApiKeyReadRepository, ApiKeyReadRepository>();
            services.AddScoped<IApiKeyWriteRepository, ApiKeyWriteRepository>();
            services.AddScoped<IApiKeyService, ApiKeyService>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Audience = "westmoor-downtime-planner.azurewebsites.net";
                    options.Authority = Configuration.GetSection("Auth0").GetValue<string>("EndpointUrl");

                    options.TokenValidationParameters.NameClaimType = "https://westmoor.rpg/ownership_id";

                    options.Events = new JwtBearerEvents
                    {
                        OnTokenValidated = SecureHeadersIdentityFactory.CreateValidator(new[]
                        {
                            ("X-Tenant-Id", "https://westmoor.rpg/campaigns", "https://westmoor.rpg/tenant")
                        })
                    };
                })
                .AddApiKeySupport();
            services.AddAuthorization(options =>
            {
                foreach (var permission in Policies.All)
                {
                    options.AddPolicy(permission, b => b
                        .RequireAuthenticatedUser()
                        .RequireClaim("https://westmoor.rpg/permissions", permission)
                    );
                }
            });

            services.AddScoped<IIdentityAccessor, HttpContextIdentityAccessor>();
            services.Configure<HttpContextTenantAccessor.Options>(options =>
            {
                options.AccessibleTenantsClaimType = "https://westmoor.rpg/campaigns";
                options.TenantClaimType = "https://westmoor.rpg/tenant";
            });
            services.AddScoped<ITenantAccessor, HttpContextTenantAccessor>();

            services.AddScoped<ICampaignReadRepository, CampaignReadRepository>();
            services.AddScoped<ICampaignWriteRepository, CampaignWriteRepository>();
            services.AddScoped<IActivityReadRepository, ActivityReadRepository>();
            services.AddScoped<IActivityWriteRepository, ActivityWriteRepository>();
            services.AddScoped<ICharacterReadRepository, CharacterReadRepository>();
            services.AddScoped<ICharacterWriteRepository, CharacterWriteRepository>();
            services.AddScoped<IDowntimeReadRepository, DowntimeReadRepository>();
            services.AddScoped<IDowntimeWriteRepository, DowntimeWriteRepository>();

            services.AddScoped<ICampaignService, CampaignService>();
            services.AddScoped<IActivityService, ActivityService>();
            services.AddScoped<ICharacterService, CharacterService>();
            services.AddScoped<IDowntimeService, DowntimeService>();

            services.AddControllersWithViews()
                .AddJsonOptions(o =>
                {
                    o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
                });
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });

            services.AddApplicationInsightsTelemetry(Configuration);
            services.AddAspNetCoreTelemetryInitializer(Configuration);
            services.AddSingleton<ITelemetryInitializer, CosmosTelemetryInitializer>();

            services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Description = "Oauth 2 identity provider.",
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Type = SecuritySchemeType.OAuth2
                });
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
                endpoints.MapControllers();
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
