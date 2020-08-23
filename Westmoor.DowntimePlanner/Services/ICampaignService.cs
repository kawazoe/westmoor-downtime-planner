using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Services
{
    public interface ICampaignService
    {
        Task<CampaignEntity[]> GetAllAsync();
        Task<CampaignEntity> GetByIdAsync(string id);
        Task CreateAsync(CreateCampaignRequest request);
        Task UpdateAsync(string id, UpdateCampaignRequest request);
        Task DeleteAsync(string idp, string id);
    }
}
