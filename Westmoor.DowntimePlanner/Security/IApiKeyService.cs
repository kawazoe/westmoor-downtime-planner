using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Security
{
    public interface IApiKeyService
    {
        Task<ApiKeyEntity[]> GetAllAsync();
        Task<ApiKeyEntity> GetByKeyAsync(string key);
        Task CreateAsync(CreateApiKeyRequest request);
        Task UpdateAsync(string key, UpdateApiKeyRequest request);
        Task RevokeAsync(string idp, string key);
    }
}
