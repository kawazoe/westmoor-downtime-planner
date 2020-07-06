using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Services
{
    public interface ICharacterService
    {
        Task<CharacterResponse[]> GetAllAsync();
        Task CreateAsync(CreateCharacterRequest request);
        Task UpdateAsync(string id, UpdateCharacterRequest request);
        Task DeleteAsync(string id);
    }
}
