using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Extensions;
using Westmoor.DowntimePlanner.Security;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class Auth0ApiUserWriteRepository : IAuth0ApiUserWriteRepository
    {
        private readonly HttpClient _httpClient;
        private readonly ITenantAccessor _tenantAccessor;
        private readonly IAuth0ApiUserReadRepository _readRepository;

        public Auth0ApiUserWriteRepository(
            HttpClient httpClient,
            ITenantAccessor tenantAccessor,
            IAuth0ApiUserReadRepository readRepository
        )
        {
            _httpClient = httpClient;
            _tenantAccessor = tenantAccessor;
            _readRepository = readRepository;
        }

        public async Task AddTenantAsync(string userId, string tenantId)
        {
            if (_tenantAccessor.ActiveTenants.Contains(tenantId))
            {
                return;
            }

            var user = await _readRepository.GetByIdAsync(userId);

            var payload = JsonSerializer.Serialize(new
            {
                user_metadata = new
                {
                    campaigns = user.UserMetadata.Campaigns
                        .Append(tenantId)
                }
            });
            var message = new HttpRequestMessage(
                    HttpMethod.Patch,
                    "/api/v2/users/" + userId
                )
                .WithJsonContent(payload);

            var response = await _httpClient.SendAsync(message);
            response.EnsureSuccessStatusCode();
        }

        public async Task RemoveTenantAsync(string userId, string tenantId)
        {
            if (_tenantAccessor.ActiveTenants.Contains(tenantId))
            {
                return;
            }

            var user = await _readRepository.GetByIdAsync(userId);

            var payload = JsonSerializer.Serialize(new
            {
                user_metadata = new
                {
                    campaigns = user.UserMetadata.Campaigns
                        .Except(new[] {tenantId})
                }
            });
            var message = new HttpRequestMessage(
                    HttpMethod.Patch,
                    "/api/v2/users/" + userId
                )
                .WithJsonContent(payload);

            var response = await _httpClient.SendAsync(message);
            response.EnsureSuccessStatusCode();
        }
    }
}
