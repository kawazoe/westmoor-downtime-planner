using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Services
{
    public interface IActivityService
    {
        Task<ActivityResponse[]> GetAllAsync();
        Task<ActivityResponse> GetByIdAsync(string id);
        Task CreateAsync(CreateActivityRequest request);
        Task UpdateAsync(string id, UpdateActivityRequest request);
        Task DeleteAsync(string id);
    }
}
