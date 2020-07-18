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
        private readonly Task<Container> _container;
        private readonly ICosmosEntityManipulator<DowntimeEntity> _entityManipulator;
        private readonly ICharacterRepository _characterRepository;
        private readonly IActivityRepository _activityRepository;

        public DowntimeRepository(
            Task<Container> container,
            ICosmosEntityManipulator<DowntimeEntity> entityManipulator,
            ICharacterRepository characterRepository,
            IActivityRepository activityRepository
        )
        {
            _container = container;
            _entityManipulator = entityManipulator;
            _characterRepository = characterRepository;
            _activityRepository = activityRepository;
        }

        public async Task<DowntimeEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<DowntimeEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = _entityManipulator.DefaultPartitionKey }
                )
                .Where(_entityManipulator.GetScopeFilterPredicate())
                .OrderByDescending(d => d.CreatedOn)
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<DowntimeEntity> GetByIdAsync(string id)
        {
            var entity = await (await _container)
                .ReadItemAsync<DowntimeEntity>(id, _entityManipulator.DefaultPartitionKey);

            return _entityManipulator.GetScopeFilterPredicate().Compile().Invoke(entity)
                ? entity
                : null;
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

            var entity = new DowntimeEntity
            {
                Character = character,
                Activity = activity,
                Costs = costs
            };

            await (await _container).CreateItemAsync(_entityManipulator.CreateMetadata(entity));
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

            var updatedEntity = new DowntimeEntity
            {
                Character = entity.Character,
                Activity = entity.Activity,
                Costs = costs
            };

            await (await _container).ReplaceItemAsync(
                _entityManipulator.UpdateMetadata(updatedEntity, entity),
                id
            );
        }

        public async Task DeleteAsync(string id)
        {
            await (await _container).DeleteItemAsync<DowntimeEntity>(id, _entityManipulator.DefaultPartitionKey);
        }
    }
}
