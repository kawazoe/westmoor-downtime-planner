using System.Linq;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Services
{
    public class CharacterService : ICharacterService
    {
        private readonly ICharacterReadRepository _readRepository;
        private readonly ICharacterWriteRepository _writeRepository;
        private readonly IDowntimeReadRepository _downtimeReadRepository;
        private readonly IDowntimeWriteRepository _downtimeWriteRepository;

        public CharacterService(
            ICharacterReadRepository readRepository,
            ICharacterWriteRepository writeRepository,
            IDowntimeReadRepository downtimeReadRepository,
            IDowntimeWriteRepository downtimeWriteRepository
        )
        {
            _readRepository = readRepository;
            _writeRepository = writeRepository;
            _downtimeReadRepository = downtimeReadRepository;
            _downtimeWriteRepository = downtimeWriteRepository;
        }

        public async Task<CharacterEntity[]> GetAllAsync() =>
            await _readRepository.GetAllAsync();

        public async Task<CharacterEntity> GetByIdAsync(string id) =>
            await _readRepository.GetByIdAsync(id);

        public async Task CreateAsync(CreateCharacterRequest request) =>
            await _writeRepository.CreateAsync(request);

        public async Task UpdateAsync(string id, UpdateCharacterRequest request)
        {
            await _writeRepository.UpdateAsync(id, request);

            var ownedDowntimes = await _downtimeReadRepository.GetAsync(d => d.Character.Id == id);

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

                await _downtimeWriteRepository.UpdateAsync(downtime.Id, downtimeUpdate);
            }
        }

        public async Task AwardAsync(string id, AwardCharacterRequest request) =>
            await _writeRepository.AwardAsync(id, request);

        public async Task DeleteAsync(string idp, string id) =>
            await _writeRepository.DeleteAsync(idp, id);
    }
}
