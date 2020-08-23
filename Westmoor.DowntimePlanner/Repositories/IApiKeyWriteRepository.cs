using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IApiKeyWriteRepository
    {
        Task CreateAsync(CreateApiKeyRequest request);
        Task UpdateAsync(string key, UpdateApiKeyRequest request);
        Task DeleteAsync(string idp, string key);
    }
}
