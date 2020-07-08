using System.Linq;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Services
{
    public class CharacterService : ICharacterService
    {
        private readonly ICharacterRepository _repository;

        public CharacterService(ICharacterRepository repository)
        {
            _repository = repository;
        }

        public async Task<CharacterResponse[]> GetAllAsync() =>
            (await _repository.GetAllAsync())
                .Select(ToResponse)
                .ToArray();

        public async Task CreateAsync(CreateCharacterRequest request) =>
            await _repository.CreateAsync(request);

        public async Task UpdateAsync(string id, UpdateCharacterRequest request) =>
            await _repository.UpdateAsync(id, request);

        public async Task DeleteAsync(string id) =>
            await _repository.DeleteAsync(id);

        private CharacterResponse ToResponse(CharacterEntity entity) =>
            new CharacterResponse
            {
                Id = entity.Id,
                PlayerFullName = entity.PlayerFullName,
                CharacterFullName = entity.CharacterFullName,
                AccruedDowntimeDays = entity.AccruedDowntimeDays
            };
    }
}
