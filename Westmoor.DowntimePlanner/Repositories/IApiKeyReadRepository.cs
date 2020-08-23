using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IApiKeyReadRepository
    {
        Task<ApiKeyEntity[]> GetAllAsync();
        Task<ApiKeyEntity> GetByKeyAsync(string key);
    }
}