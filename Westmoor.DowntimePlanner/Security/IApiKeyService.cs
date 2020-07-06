using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Security
{
    public interface IApiKeyService
    {
        Task<ApiKeyResponse[]> GetAllAsync();
        Task<ApiKeyResponse> GetByKeyAsync(string key);
        Task CreateAsync(CreateApiKeyRequest request);
        Task UpdateAsync(string key, UpdateApiKeyRequest request);
        Task RevokeAsync(string key);
    }
}
