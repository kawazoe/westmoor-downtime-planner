using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Westmoor.DowntimePlanner.Security
{
    public static class DependencyInjectionExtensions
    {
        public static AuthenticationBuilder AddApiKeySupport(this AuthenticationBuilder authenticationBuilder, Action<ApiKeyAuthenticationOptions> options = null)
        {
            return authenticationBuilder.AddScheme<ApiKeyAuthenticationOptions, ApiKeyAuthenticationHandler>(ApiKeyAuthenticationOptions.DefaultScheme, options ?? (o => {}));
        }

        public static IServiceCollection AddOAuthTokens(this IServiceCollection services)
        {
            services.TryAddSingleton<Func<string, JwtSecurityToken>>(jwt => new JwtSecurityTokenHandler().ReadJwtToken(jwt));
            services.TryAddSingleton<ITokenStore, OAuthTokenStore>();
            services.TryAddTransient<OAuthTokenDelegatingHandler>();

            return services;
        }

        public static IHttpClientBuilder AddOAuthTokens(this IHttpClientBuilder builder)
        {
            builder.Services.AddOAuthTokens();

            return builder.AddHttpMessageHandler<OAuthTokenDelegatingHandler>();
        }
    }
}
