using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface ICampaignWriteRepository
    {
        Task CreateAsync(CreateCampaignRequest request);
        Task UpdateAsync(string id, UpdateCampaignRequest request);
        Task DeleteAsync(string idp, string id);
    }
}
