using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IAuth0ApiUserRepository
    {
        Task<UserEntity[]> SearchByEmailAsync(string email);
    }
}
