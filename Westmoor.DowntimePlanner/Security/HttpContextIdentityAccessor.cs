using Microsoft.AspNetCore.Http;

namespace Westmoor.DowntimePlanner.Security
{
    public class HttpContextIdentityAccessor : IIdentityAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpContextIdentityAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string Identity => _httpContextAccessor.HttpContext.User.Identity.Name;
    }
}
