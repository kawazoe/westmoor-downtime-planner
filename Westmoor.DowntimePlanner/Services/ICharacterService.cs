using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Services
{
    public interface ICharacterService
    {
        Task<CharacterResponse[]> GetAllAsync();
        Task<CharacterResponse> GetByIdAsync(string id);
        Task CreateAsync(CreateCharacterRequest request);
        Task UpdateAsync(string id, UpdateCharacterRequest request);
        Task AwardAsync(string id, AwardCharacterRequest request);
        Task DeleteAsync(string id);
    }
}
