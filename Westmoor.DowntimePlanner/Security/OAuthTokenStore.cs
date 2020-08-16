using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace Westmoor.DowntimePlanner.Security
{
    public class OAuthTokenStore : ITokenStore
    {
        /// <summary>
        /// { "alg": "HS256", "typ": "JWT" }.{ "sub": "0", "iat": 0, "exp": 0 }."null"
        /// </summary>
        private const string NullJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwiaWF0IjowLCJleHAiOjB9.punB5kh-nfx60sVyKdZQl5pW7syFxpzaO6mkjXHV6N8";

        public class Options
        {
            public string EndpointUrl { get; set; }
            public string ClientId { get; set; }
            public string ClientSecret { get; set; }
            public string Audience { get; set; }
        }

        private readonly IClock _clock;
        private readonly Options _options;
        private readonly Func<string, JwtSecurityToken> _jwtReader;

        private Lazy<Task<OAuthToken>> _currentToken;

        public OAuthTokenStore(
            IClock clock,
            IOptions<Options> options,
            Func<string, JwtSecurityToken> jwtReader
        )
        {
            _clock = clock;
            _options = options.Value;
            _jwtReader = jwtReader;

            _currentToken = new Lazy<Task<OAuthToken>>(() =>
                Task.FromResult(new OAuthToken
                {
                    AccessToken = NullJwt,
                    TokenType = "Bearer"
                })
            );
        }

        public async Task<TResult> WithTokenAsync<TResult>(
            Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> sendAsync,
            Func<OAuthToken, Task<TResult>> func
        )
        {
            var token = await _currentToken.Value;

            if (!IsTokenCurrent(token.AccessToken))
            {
                _currentToken = new Lazy<Task<OAuthToken>>(() => GetOauthTokenAsync(sendAsync));

                token = await _currentToken.Value;
            }

            return await func.Invoke(token);
        }

        public async Task WithTokenAsync(
            Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> sendAsync,
            Func<OAuthToken, Task> func
        )
        {
            await WithTokenAsync<object>(
                sendAsync,
                async token =>
                {
                    await func.Invoke(token);
                    return null;
                }
            );
        }

        private bool IsTokenCurrent(string token)
        {
            var securityToken = _jwtReader.Invoke(token);
            var now = _clock.UtcNow;
            return securityToken.ValidFrom < now && securityToken.ValidTo > now;
        }

        private async Task<OAuthToken> GetOauthTokenAsync(
            Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> sendAsync
        )
        {
            var payload = JsonSerializer.Serialize(new
            {
                client_id = _options.ClientId,
                client_secret = _options.ClientSecret,
                audience = _options.Audience,
                grant_type = "client_credentials"
            });

            var message = new HttpRequestMessage(
                HttpMethod.Post,
                $"{_options.EndpointUrl}/oauth/token"
            )
            {
                Content = new StringContent(payload, Encoding.UTF8, "application/json")
            };

            var response = await sendAsync.Invoke(message, CancellationToken.None);

            response.EnsureSuccessStatusCode();

            var stream = await response.Content.ReadAsStreamAsync();
            return await JsonSerializer.DeserializeAsync<OAuthToken>(stream);
        }
    }
}
