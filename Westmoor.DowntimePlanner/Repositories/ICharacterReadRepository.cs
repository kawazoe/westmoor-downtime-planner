using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface ICharacterReadRepository
    {
        Task<CharacterEntity[]> GetAllAsync();
        Task<CharacterEntity> GetByIdAsync(string id);
    }
}