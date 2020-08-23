using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IAuth0ApiUserReadRepository
    {
        Task<UserEntity[]> SearchAsync(string query);
        Task<UserEntity> GetByIdAsync(string id);
        Task<string[]> GetTenantsAsync(string id);
    }
}