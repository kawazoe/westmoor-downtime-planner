using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class DowntimeRepository : IDowntimeRepository
    {
        private readonly IClock _clock;
        private readonly Task<Container> _container;
        private readonly ICharacterRepository _characterRepository;
        private readonly IActivityRepository _activityRepository;

        private const string KindKeyValue = nameof(DowntimeEntity);
        private static PartitionKey KindKey => new PartitionKey(KindKeyValue);

        public DowntimeRepository(
            IClock clock,
            Task<Container> container,
            ICharacterRepository characterRepository,
            IActivityRepository activityRepository
        )
        {
            _clock = clock;
            _container = container;
            _characterRepository = characterRepository;
            _activityRepository = activityRepository;
        }

        public async Task<DowntimeEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<DowntimeEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = KindKey }
                )
                .OrderByDescending(d => d.CreatedOn)
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<DowntimeEntity> GetByIdAsync(string id)
        {
            return await (await _container).ReadItemAsync<DowntimeEntity>(id, KindKey);
        }

        public async Task CreateAsync(CreateDowntimeRequest request)
        {
            var character = await _characterRepository.GetByIdAsync(request.CharacterId);
            var activity = await _activityRepository.GetByIdAsync(request.ActivityId);
            var costs = request.Costs
                .Select(p => new DowntimeCostEntity
                {
                    ActivityCostKind = p.ActivityCostKind,
                    Value = 0,
                    Goal = p.Goal
                })
                .ToArray();

            await (await _container).CreateItemAsync(
                new DowntimeEntity
                {
                    Id = Guid.NewGuid().ToString(),
                    Idp = KindKeyValue,
                    Character = character,
                    Activity = activity,
                    Costs = costs,
                    CreatedOn = _clock.UtcNow
                }
            );
        }

        public async Task UpdateAsync(string id, UpdateDowntimeRequest request)
        {
            var entity = await GetByIdAsync(id);

            var costs = request.Costs
                .Select(p => new DowntimeCostEntity
                {
                    ActivityCostKind = p.ActivityCostKind,
                    Value = p.Value,
                    Goal = p.Goal
                })
                .ToArray();

            await (await _container).ReplaceItemAsync(
                new DowntimeEntity
                {
                    Id = entity.Id,
                    Idp = entity.Idp,
                    Character = entity.Character,
                    Activity = entity.Activity,
                    Costs = costs,
                    CreatedOn = entity.CreatedOn,
                    ModifiedOn = _clock.UtcNow
                },
                id
            );
        }

        public async Task DeleteAsync(string id)
        {
            await (await _container).DeleteItemAsync<DowntimeEntity>(id, KindKey);
        }
    }
}
