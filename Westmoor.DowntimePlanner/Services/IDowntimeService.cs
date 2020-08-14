using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Services
{
    public interface IDowntimeService
    {
        Task<DowntimeEntity[]> GetCurrentAsync();
        Task<DowntimeEntity[]> GetCompletedAsync();
        Task<DowntimeEntity> GetByIdAsync(string id);
        Task CreateAsync(CreateDowntimeRequest request);
        Task UpdateAsync(string id, UpdateDowntimeRequest request);
        Task AdvanceAsync(string id, AdvanceDowntimeRequest request);
        Task AdvanceBatchAsync(AdvanceDowntimeBatchRequest request);
        Task DeleteAsync(string id);
    }
}
