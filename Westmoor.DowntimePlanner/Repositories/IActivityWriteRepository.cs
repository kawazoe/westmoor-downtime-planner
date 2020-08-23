using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IActivityWriteRepository
    {
        Task CreateAsync(CreateActivityRequest request);
        Task UpdateAsync(string id, UpdateActivityRequest request);
        Task DeleteAsync(string idp, string id);
    }
}
