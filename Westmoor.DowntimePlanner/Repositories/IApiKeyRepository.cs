using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IApiKeyRepository
    {
        Task<ApiKeyEntity[]> GetAllAsync();
        Task<ApiKeyEntity> GetByKeyAsync(string key);
        Task CreateAsync(CreateApiKeyRequest request);
        Task UpdateAsync(string key, UpdateApiKeyRequest request);
        Task DeleteAsync(string key);
    }
}
