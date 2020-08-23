using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class CharacterWriteRepository : ICharacterWriteRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityMutator<CharacterEntity> _entityMutator;
        private readonly ICharacterReadRepository _readRepository;

        public CharacterWriteRepository(
            Task<Container> container,
            ICosmosEntityMutator<CharacterEntity> entityMutator,
            ICharacterReadRepository readRepository
        )
        {
            _container = container;
            _entityMutator = entityMutator;
            _readRepository = readRepository;
        }

        public async Task CreateAsync(CreateCharacterRequest request)
        {
            var entity = new CharacterEntity
            {
                PlayerFullName = request.PlayerFullName,
                CharacterFullName = request.CharacterFullName,
                AccruedDowntimeDays = 0
            };

            await (await _container).CreateItemAsync(await _entityMutator.CreateMetadataAsync(entity, request.SharedWith));
        }

        public async Task UpdateAsync(string id, UpdateCharacterRequest request)
        {
            var entity = await _readRepository.GetByIdAsync(id);

            var updatedEntity = new CharacterEntity
            {
                PlayerFullName = request.PlayerFullName,
                CharacterFullName = request.CharacterFullName,
                AccruedDowntimeDays = request.AccruedDowntimeDays
            };

            await (await _container).ReplaceItemAsync(
                await _entityMutator.UpdateMetadataAsync(updatedEntity, entity, request.SharedWith),
                id
            );
        }

        public async Task AwardAsync(string id, AwardCharacterRequest request)
        {
            var entity = await _readRepository.GetByIdAsync(id);

            var updatedEntity = new CharacterEntity
            {
                PlayerFullName = entity.PlayerFullName,
                CharacterFullName = entity.CharacterFullName,
                AccruedDowntimeDays = entity.AccruedDowntimeDays + request.Delta
            };

            await (await _container).ReplaceItemAsync(
                await _entityMutator.UpdateMetadataAsync(updatedEntity, entity, null),
                id
            );
        }

        public async Task DeleteAsync(string idp, string id)
        {
            await (await _container).DeleteItemAsync<CharacterEntity>(id, new PartitionKey(idp));
        }
    }
}
