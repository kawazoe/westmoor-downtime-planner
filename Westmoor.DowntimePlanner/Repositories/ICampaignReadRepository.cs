using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface ICampaignReadRepository
    {
        Task<CampaignEntity[]> GetAllAsync();
        Task<CampaignEntity> GetByIdAsync(string id);
    }
}