using System;
using System.Linq;
using System.Linq.Expressions;
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

        public async Task<DowntimeEntity[]> GetAsync(Expression<Func<DowntimeEntity, bool>> predicate)
        {
            return await (await _container).GetItemLinqQueryable<DowntimeEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = _entityManipulator.DefaultPartitionKey }
                )
                .Where(predicate)
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
                Costs = costs,
                SharedWith = request.SharedWith
                    .Concat(character.SharedWith)
                    .Concat(activity.SharedWith)
                    .ToArray()
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
                Costs = costs,
                SharedWith = request.SharedWith
            };

            await (await _container).ReplaceItemAsync(
                _entityManipulator.UpdateMetadata(updatedEntity, entity),
                id
            );
        }

        public async Task AdvanceAsync(string id, AdvanceDowntimeRequest request)
        {
            var entity = await GetByIdAsync(id);

            var costs = entity.Costs
                .Select(cost => (
                    source: cost,
                    req: request.Costs
                        .FirstOrDefault(c => c.ActivityCostKind == cost.ActivityCostKind)
                ))
                .Select(cost => new DowntimeCostEntity
                {
                    ActivityCostKind = cost.source.ActivityCostKind,
                    Value = cost.req != null
                        ? cost.source.Value + cost.req.Delta
                        : cost.source.Value,
                    Goal = cost.source.Goal
                })
                .ToArray();

            var updatedEntity = new DowntimeEntity
            {
                Character = entity.Character,
                Activity = entity.Activity,
                Costs = costs,
                SharedWith = entity.SharedWith
            };

            await (await _container).ReplaceItemAsync(
                _entityManipulator.UpdateMetadata(updatedEntity, entity),
                id
            );
        }

        public async Task AdvanceBatchAsync(AdvanceDowntimeBatchRequest request)
        {
            var downtimes = await request.Ids
                .ToAsyncEnumerable()
                .SelectAwait(async id => await GetByIdAsync(id))
                .ToArrayAsync();

            foreach (var entity in downtimes)
            {
                var costs = entity.Costs
                    .Select(cost => (
                        source: cost,
                        req: request.Request.Costs
                            .FirstOrDefault(c => c.ActivityCostKind == cost.ActivityCostKind)
                    ))
                    .Select(cost => new DowntimeCostEntity
                    {
                        ActivityCostKind = cost.source.ActivityCostKind,
                        Value = cost.req != null
                            ? cost.source.Value + cost.req.Delta
                            : cost.source.Value,
                        Goal = cost.source.Goal
                    })
                    .ToArray();

                var updatedEntity = new DowntimeEntity
                {
                    Character = entity.Character,
                    Activity = entity.Activity,
                    Costs = costs,
                    SharedWith = entity.SharedWith
                };

                await (await _container).ReplaceItemAsync(
                    _entityManipulator.UpdateMetadata(updatedEntity, entity),
                    entity.Id
                );
            }

            var deltasByKindByCharacter = downtimes
                .GroupBy(d => d.Character.Id)
                .Select(g => (
                    characterId: g.Key,
                    kinds: g
                        .SelectMany(p => p.Costs)
                        .GroupBy(c => c.ActivityCostKind)
                        .Select(cost =>
                        {
                            var delta = request.Request.Costs
                                .FirstOrDefault(c => c.ActivityCostKind == cost.Key)
                                ?.Delta
                                ?? 0;

                            return (
                                activityCostKind: cost.Key,
                                delta: delta * cost.Count()
                            );
                        })
                        .Where(req => req != default)
                ));

            var daysDeltaByCharacter = deltasByKindByCharacter
                .Select(character => (
                    character.characterId,
                    // Limit requests to days as it is the only supported kind by the character api.
                    request: new AwardCharacterRequest
                    {
                        Delta = - character.kinds
                            .FirstOrDefault(c => c.activityCostKind == "days")
                            .delta
                    }
                ))
                .Where(req => req.request.Delta != 0);

            foreach (var (characterId, characterRequest) in daysDeltaByCharacter)
            {
                await _characterRepository.AwardAsync(characterId, characterRequest);
            }
        }

        public async Task DeleteAsync(string id)
        {
            await (await _container).DeleteItemAsync<DowntimeEntity>(id, _entityManipulator.DefaultPartitionKey);
        }
    }
}
