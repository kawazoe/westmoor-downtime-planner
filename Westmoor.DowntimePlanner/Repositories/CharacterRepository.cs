using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class CharacterRepository : ICharacterRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityManipulator<CharacterEntity> _entityManipulator;

        public CharacterRepository(
            Task<Container> container,
            ICosmosEntityManipulator<CharacterEntity> entityManipulator
        )
        {
            _container = container;
            _entityManipulator = entityManipulator;
        }

        public async Task<CharacterEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<CharacterEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = _entityManipulator.DefaultPartitionKey }
                )
                .Where(_entityManipulator.GetScopeFilterPredicate())
                .OrderBy(c => c.PlayerFullName)
                .ThenBy(c => c.CharacterFullName)
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<CharacterEntity> GetByIdAsync(string id)
        {
            var entity = await (await _container)
                .ReadItemAsync<CharacterEntity>(id, _entityManipulator.DefaultPartitionKey);

            return _entityManipulator.GetScopeFilterPredicate().Compile().Invoke(entity)
                ? entity
                : null;
        }

        public async Task CreateAsync(CreateCharacterRequest request)
        {
            var entity = new CharacterEntity
            {
                PlayerFullName = request.PlayerFullName,
                CharacterFullName = request.CharacterFullName,
                AccruedDowntimeDays = 0
            };

            await (await _container).CreateItemAsync(await _entityManipulator.CreateMetadataAsync(entity, request.SharedWith));
        }

        public async Task UpdateAsync(string id, UpdateCharacterRequest request)
        {
            var entity = await GetByIdAsync(id);

            var updatedEntity = new CharacterEntity
            {
                PlayerFullName = request.PlayerFullName,
                CharacterFullName = request.CharacterFullName,
                AccruedDowntimeDays = request.AccruedDowntimeDays
            };

            await (await _container).ReplaceItemAsync(
                await _entityManipulator.UpdateMetadataAsync(updatedEntity, entity, request.SharedWith),
                id
            );
        }

        public async Task AwardAsync(string id, AwardCharacterRequest request)
        {
            var entity = await GetByIdAsync(id);

            var updatedEntity = new CharacterEntity
            {
                PlayerFullName = entity.PlayerFullName,
                CharacterFullName = entity.CharacterFullName,
                AccruedDowntimeDays = entity.AccruedDowntimeDays + request.Delta
            };

            await (await _container).ReplaceItemAsync(
                await _entityManipulator.UpdateMetadataAsync(updatedEntity, entity, null),
                id
            );
        }

        public async Task DeleteAsync(string id)
        {
            await (await _container).DeleteItemAsync<CharacterEntity>(id, _entityManipulator.DefaultPartitionKey);
        }
    }
}
