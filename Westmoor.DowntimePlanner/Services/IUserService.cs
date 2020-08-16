using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Services
{
    public interface IUserService
    {
        Task<UserResponse[]> SearchAsync(string query);
        Task<UserResponse> GetByIdAsync(string id);
        Task<string[]> GetCampaignsAsync(string id);
        Task AddCampaignAsync(string id, AddCampaignRequest request);
        Task RemoveCampaignAsync(string id, string campaignId);
    }
}
