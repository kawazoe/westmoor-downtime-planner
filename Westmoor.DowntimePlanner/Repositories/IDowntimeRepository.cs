using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IDowntimeRepository
    {
        Task<DowntimeEntity[]> GetAllAsync();
        Task<DowntimeEntity> GetByIdAsync(string id);
        Task CreateAsync(CreateDowntimeRequest request);
        Task UpdateAsync(string id, UpdateDowntimeRequest request);
        Task DeleteAsync(string id);
    }
}
