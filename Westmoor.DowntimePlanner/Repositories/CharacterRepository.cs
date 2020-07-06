using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class CharacterRepository : ICharacterRepository
    {
        public async Task<CharacterEntity[]> GetAllAsync()
        {
            throw new System.NotImplementedException();
        }

        public async Task<CharacterEntity> GetByIdAsync(string id)
        {
            throw new System.NotImplementedException();
        }

        public async Task CreateAsync(CreateCharacterRequest request)
        {
            throw new System.NotImplementedException();
        }

        public async Task UpdateAsync(string id, UpdateCharacterRequest request)
        {
            throw new System.NotImplementedException();
        }

        public async Task DeleteAsync(string id)
        {
            throw new System.NotImplementedException();
        }
    }
}
