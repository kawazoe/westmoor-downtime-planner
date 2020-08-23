using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Westmoor.DowntimePlanner.Security
{
    public class HttpContextTenantAccessor : ITenantAccessor
    {
        public class Options
        {
            public string AccessibleTenantsClaimType { get; set; }
            public string TenantClaimType { get; set; }
        }

        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly Options _options;

        public HttpContextTenantAccessor(IHttpContextAccessor httpContextAccessor, IOptions<Options> options)
        {
            _httpContextAccessor = httpContextAccessor;
            _options = options.Value;
        }

        public string[] AccessibleTenants => _httpContextAccessor.HttpContext.User.Claims
            .Where(c => c.Type.Equals(_options.AccessibleTenantsClaimType, StringComparison.OrdinalIgnoreCase))
            .Select(c => c.Value)
            .ToArray();

        public string[] ActiveTenants => _httpContextAccessor.HttpContext.User.Claims
            .Where(c => string.Equals(c.Type, _options.TenantClaimType, StringComparison.OrdinalIgnoreCase))
            .Select(c => c.Value)
            .ToArray();
    }
}
