using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Services
{
    public interface IDowntimeService
    {
        Task<DowntimeResponse[]> GetCurrentAsync();
        Task<DowntimeResponse[]> GetCompletedAsync();
        Task<DowntimeResponse> GetByIdAsync(string id);
        Task CreateAsync(CreateDowntimeRequest request);
        Task UpdateAsync(string id, UpdateDowntimeRequest request);
        Task DeleteAsync(string id);
    }
}
