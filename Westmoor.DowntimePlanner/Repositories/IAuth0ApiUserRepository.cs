using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IAuth0ApiUserRepository
    {
        Task<UserEntity[]> SearchAsync(string query);
        Task<UserEntity> GetByIdAsync(string id);
        Task<string[]> GetTenantsAsync(string id);
        Task AddTenantAsync(string userId, string tenantId);
        Task RemoveTenantAsync(string userId, string tenantId);
    }
}
