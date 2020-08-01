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
        private readonly IDowntimeRepository _downtimeRepository;

        public CharacterService(
            ICharacterRepository repository,
            IDowntimeRepository downtimeRepository
        )
        {
            _repository = repository;
            _downtimeRepository = downtimeRepository;
        }

        public async Task<CharacterResponse[]> GetAllAsync() =>
            (await _repository.GetAllAsync())
                .Select(ToResponse)
                .ToArray();

        public async Task<CharacterResponse> GetByIdAsync(string id) =>
            ToResponse(await _repository.GetByIdAsync(id));

        public async Task CreateAsync(CreateCharacterRequest request) =>
            await _repository.CreateAsync(request);

        public async Task UpdateAsync(string id, UpdateCharacterRequest request)
        {
            await _repository.UpdateAsync(id, request);

            var ownedDowntimes = await _downtimeRepository.GetAsync(d => d.Character.Id == id);

            foreach (var downtime in ownedDowntimes)
            {
                var downtimeUpdate = new UpdateDowntimeRequest
                {
                    Costs = downtime.Costs
                        .Select(c => new UpdateDowntimeCostRequest
                        {
                            ActivityCostKind = c.ActivityCostKind,
                            Goal = c.Goal,
                            Value = c.Value
                        })
                        .ToArray(),
                    SharedWith = request.SharedWith
                };

                await _downtimeRepository.UpdateAsync(downtime.Id, downtimeUpdate);
            }
        }

        public async Task AwardAsync(string id, AwardDowntimeRequest request) =>
            await _repository.AwardAsync(id, request);

        public async Task DeleteAsync(string id) =>
            await _repository.DeleteAsync(id);

        private CharacterResponse ToResponse(CharacterEntity entity) =>
            new CharacterResponse
            {
                Id = entity.Id,
                PlayerFullName = entity.PlayerFullName,
                CharacterFullName = entity.CharacterFullName,
                AccruedDowntimeDays = entity.AccruedDowntimeDays,
                SharedWith = entity.SharedWith
            };
    }
}
