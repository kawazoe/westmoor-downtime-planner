using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Extensions;

namespace Westmoor.DowntimePlanner.Security
{
    public class OAuthTokenDelegatingHandler : DelegatingHandler
    {
        private readonly ITokenStore _tokenStore;

        public OAuthTokenDelegatingHandler(ITokenStore tokenStore)
        {
            _tokenStore = tokenStore;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            return await _tokenStore.WithTokenAsync(
                base.SendAsync,
                token => base.SendAsync(request.WithBearerToken(token), cancellationToken)
            );
        }
    }
}
