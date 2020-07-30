using System.Collections.Generic;
using System.Linq;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Westmoor.DowntimePlanner
{
    public static class AspNetCoreTelemetryInitializerExtensions
    {
        const string ConfigPath = "ApplicationInsights:GlobalCustomProperties";

        public static IServiceCollection AddAspNetCoreTelemetryInitializer(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            services.AddOptions();
            services.AddHttpContextAccessor();
            services.Configure<AspNetCoreTelemetryInitializer.Options>(o =>
            {
                o.GlobalProperties = configuration
                    .GetSection(ConfigPath)
                    .AsEnumerable()
                    .Skip(1)
                    .Select(kvp => (Key: kvp.Key.Substring(ConfigPath.Length + 1), kvp.Value))
                    .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            });
            services.AddSingleton<ITelemetryInitializer, AspNetCoreTelemetryInitializer>();

            return services;
        }
    }

    public class AspNetCoreTelemetryInitializer : ITelemetryInitializer
    {
        public class Options
        {
            public IDictionary<string, string> GlobalProperties { get; set; }
        }

        private readonly Options _options;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AspNetCoreTelemetryInitializer(
            IOptions<Options> options,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _options = options.Value;
            _httpContextAccessor = httpContextAccessor;
        }

        public void Initialize(ITelemetry telemetry)
        {
            foreach (var kvp in _options.GlobalProperties)
            {
                telemetry.Context.GlobalProperties.Add(kvp);
            }

            var identityName = _httpContextAccessor.HttpContext?.User.Identity.Name;

            if (!string.IsNullOrEmpty(identityName))
            {
                telemetry.Context.User.AuthenticatedUserId = identityName;
            }
        }
    }
}
