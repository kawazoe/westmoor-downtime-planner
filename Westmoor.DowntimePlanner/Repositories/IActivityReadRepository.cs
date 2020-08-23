using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IActivityReadRepository
    {
        Task<ActivityEntity[]> GetAllAsync();
        Task<ActivityEntity> GetByIdAsync(string id);
    }
}