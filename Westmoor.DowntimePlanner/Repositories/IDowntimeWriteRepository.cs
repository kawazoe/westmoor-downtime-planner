using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IDowntimeWriteRepository
    {
        Task CreateAsync(CreateDowntimeRequest request);
        Task UpdateAsync(string id, UpdateDowntimeRequest request);
        Task AdvanceAsync(string id, AdvanceDowntimeRequest request);
        Task AdvanceBatchAsync(AdvanceDowntimeBatchRequest request);
        Task DeleteAsync(string idp, string id);
    }
}
