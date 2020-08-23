using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Services
{
    public interface ICharacterService
    {
        Task<CharacterEntity[]> GetAllAsync();
        Task<CharacterEntity> GetByIdAsync(string id);
        Task CreateAsync(CreateCharacterRequest request);
        Task UpdateAsync(string id, UpdateCharacterRequest request);
        Task AwardAsync(string id, AwardCharacterRequest request);
        Task DeleteAsync(string idp, string id);
    }
}
