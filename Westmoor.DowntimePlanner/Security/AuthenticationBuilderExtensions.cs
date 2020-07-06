using System;
using Microsoft.AspNetCore.Authentication;

namespace Westmoor.DowntimePlanner.Security
{
    public static class AuthenticationBuilderExtensions
    {
        public static AuthenticationBuilder AddApiKeySupport(this AuthenticationBuilder authenticationBuilder, Action<ApiKeyAuthenticationOptions> options = null)
        {
            return authenticationBuilder.AddScheme<ApiKeyAuthenticationOptions, ApiKeyAuthenticationHandler>(ApiKeyAuthenticationOptions.DefaultScheme, options ?? (o => {}));
        }
    }
}
