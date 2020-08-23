using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface ICharacterWriteRepository
    {
        Task CreateAsync(CreateCharacterRequest request);
        Task UpdateAsync(string id, UpdateCharacterRequest request);
        Task AwardAsync(string id, AwardCharacterRequest request);
        Task DeleteAsync(string idp, string id);
    }
}
