using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Services
{
    public interface IActivityService
    {
        Task<ActivityEntity[]> GetAllAsync();
        Task<ActivityEntity> GetByIdAsync(string id);
        Task CreateAsync(CreateActivityRequest request);
        Task UpdateAsync(string id, UpdateActivityRequest request);
        Task DeleteAsync(string id);
    }
}
