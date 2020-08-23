using System.Threading.Tasks;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IAuth0ApiUserWriteRepository
    {
        Task AddTenantAsync(string userId, string tenantId);
        Task RemoveTenantAsync(string userId, string tenantId);
    }
}
