using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class Auth0ApiUserRepository : IAuth0ApiUserRepository
    {
        public class Options
        {
            public string EndpointUrl { get; set; }
            public string ClientId { get; set; }
            public string ClientSecret { get; set; }
            public string Audience { get; set; }
        }

        private static readonly string[] Fields =
        {
            "user_id",
            "email",
            "username",
            "picture",
            "name",
            "user_metadata.ownership_id",
            "user_metadata.campaigns"
        };
        private static readonly string FieldsQuery = string.Join(",", Fields);

        private readonly IClock _clock;
        private readonly Options _options;
        private readonly HttpClient _httpClient;
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler;

        private Lazy<Task<OauthTokenEntity>> _currentToken;

        public Auth0ApiUserRepository(
            IClock clock,
            IOptions<Options> options,
            IHttpClientFactory httpClientFactory,
            JwtSecurityTokenHandler jwtSecurityTokenHandler
        )
        {
            _clock = clock;
            _options = options.Value;
            _httpClient = httpClientFactory.CreateClient(nameof(Auth0ApiUserRepository));
            _jwtSecurityTokenHandler = jwtSecurityTokenHandler;

            _currentToken = new Lazy<Task<OauthTokenEntity>>(GetOauthTokenAsync);
        }

        public async Task<UserEntity[]> SearchAsync(string query) =>
            await WithTokenAsync(async token =>
            {
                var request = new Dictionary<string, string>
                {
                    { "fields", FieldsQuery },
                    { "q", query },
                    { "per_page", "10" },
                    { "sort", "query:1" },
                    { "search_engine", "v3" }
                };
                var message = new HttpRequestMessage(
                    HttpMethod.Get,
                    QueryHelpers.AddQueryString($"{_options.EndpointUrl}/api/v2/users", request)
                )
                {
                    Headers =
                    {
                        Authorization = new AuthenticationHeaderValue(
                            token.TokenType,
                            token.AccessToken
                        )
                    }
                };

                var response = await _httpClient.SendAsync(message);

                if (!response.IsSuccessStatusCode)
                {
                    return new UserEntity[0];
                }

                var stream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<UserEntity[]>(stream);
            });

        private async Task<TResult> WithTokenAsync<TResult>(Func<OauthTokenEntity, Task<TResult>> func)
        {
            var token = await _currentToken.Value;

            if (!IsTokenCurrent(token.AccessToken))
            {
                _currentToken = new Lazy<Task<OauthTokenEntity>>(GetOauthTokenAsync);

                token = await _currentToken.Value;
            }

            return await func.Invoke(token);
        }

        private bool IsTokenCurrent(string token)
        {
            var securityToken = _jwtSecurityTokenHandler.ReadJwtToken(token);
            var now = _clock.UtcNow;
            return securityToken.ValidFrom < now && securityToken.ValidTo > now;
        }

        private async Task<OauthTokenEntity> GetOauthTokenAsync()
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

            var response = await _httpClient.SendAsync(message);

            response.EnsureSuccessStatusCode();

            var stream = await response.Content.ReadAsStreamAsync();
            return await JsonSerializer.DeserializeAsync<OauthTokenEntity>(stream);
        }
    }
}
