using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.WebUtilities;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Security;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class Auth0ApiUserReadRepository : IAuth0ApiUserReadRepository
    {
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

        private readonly HttpClient _httpClient;
        private readonly ITenantAccessor _tenantAccessor;

        public Auth0ApiUserReadRepository(
            HttpClient httpClient,
            ITenantAccessor tenantAccessor
        )
        {
            _httpClient = httpClient;
            _tenantAccessor = tenantAccessor;
        }

        public async Task<UserEntity[]> SearchAsync(string query)
        {
            var tenants = string.Join(" ", _tenantAccessor.AccessibleTenants.Select(s => $"\"{s}\""));
            var request = new Dictionary<string, string>
            {
                {"fields", FieldsQuery},
                {"q", $"user_metadata.campaigns:({tenants})^0 AND ({query})"},
                {"per_page", "10"},
                {"sort", "query:1"},
                {"search_engine", "v3"}
            };
            var message = new HttpRequestMessage(
                    HttpMethod.Get,
                    QueryHelpers.AddQueryString("/api/v2/users", request)
                );

            var response = await _httpClient.SendAsync(message);

            if (!response.IsSuccessStatusCode)
            {
                return new UserEntity[0];
            }

            var stream = await response.Content.ReadAsStreamAsync();
            return await JsonSerializer.DeserializeAsync<UserEntity[]>(stream);
        }

        public async Task<UserEntity> GetByIdAsync(string id)
        {
            var message = new HttpRequestMessage(
                    HttpMethod.Get,
                    "/api/v2/users/" + id
                );

            var response = await _httpClient.SendAsync(message);
            response.EnsureSuccessStatusCode();

            var stream = await response.Content.ReadAsStreamAsync();
            var result = await JsonSerializer.DeserializeAsync<UserEntity>(stream);

            var tenants = _tenantAccessor.AccessibleTenants;
            var isWithinAccessibleTenants = result.UserMetadata.Campaigns.Any(c => tenants.Contains(c));
            return isWithinAccessibleTenants
                ? result
                : null;
        }

        public async Task<string[]> GetTenantsAsync(string id) =>
            (await GetByIdAsync(id)).UserMetadata.Campaigns;
    }
}
