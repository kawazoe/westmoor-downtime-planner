using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class DowntimeWriteRepository : IDowntimeWriteRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityMutator<DowntimeEntity> _entityMutator;
        private readonly IDowntimeReadRepository _readRepository;
        private readonly IActivityReadRepository _activityReadRepository;
        private readonly ICharacterReadRepository _characterReadRepository;
        private readonly ICharacterWriteRepository _characterWriteRepository;

        public DowntimeWriteRepository(
            Task<Container> container,
            ICosmosEntityMutator<DowntimeEntity> entityMutator,
            IDowntimeReadRepository readRepository,
            IActivityReadRepository activityReadRepository,
            ICharacterReadRepository characterReadRepository,
            ICharacterWriteRepository characterWriteRepository
        )
        {
            _container = container;
            _entityMutator = entityMutator;
            _readRepository = readRepository;
            _activityReadRepository = activityReadRepository;
            _characterReadRepository = characterReadRepository;
            _characterWriteRepository = characterWriteRepository;
        }

        public async Task CreateAsync(CreateDowntimeRequest request)
        {
            var character = await _characterReadRepository.GetByIdAsync(request.CharacterId);
            var activity = await _activityReadRepository.GetByIdAsync(request.ActivityId);
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
                SharedWith = character.SharedWith.Concat(activity.SharedWith).ToArray()
            };

            await (await _container).CreateItemAsync(await _entityMutator.CreateMetadataAsync(entity, request.SharedWith));
        }

        public async Task UpdateAsync(string id, UpdateDowntimeRequest request)
        {
            var entity = await _readRepository.GetByIdAsync(id);

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
                await _entityMutator.UpdateMetadataAsync(updatedEntity, entity, request.SharedWith),
                id
            );
        }

        public async Task AdvanceAsync(string id, AdvanceDowntimeRequest request)
        {
            var entity = await _readRepository.GetByIdAsync(id);

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
                Costs = costs
            };

            await (await _container).ReplaceItemAsync(
                await _entityMutator.UpdateMetadataAsync(updatedEntity, entity, null),
                id
            );
        }

        public async Task AdvanceBatchAsync(AdvanceDowntimeBatchRequest request)
        {
            var downtimes = await request.Ids
                .ToAsyncEnumerable()
                .SelectAwait(async id => await _readRepository.GetByIdAsync(id))
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
                    Costs = costs
                };

                await (await _container).ReplaceItemAsync(
                    await _entityMutator.UpdateMetadataAsync(updatedEntity, entity, null),
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
                await _characterWriteRepository.AwardAsync(characterId, characterRequest);
            }
        }

        public async Task DeleteAsync(string idp, string id)
        {
            await (await _container).DeleteItemAsync<DowntimeEntity>(id, new PartitionKey(idp));
        }
    }
}
