using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class ApiKeyWriteRepository : IApiKeyWriteRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityMutator<ApiKeyEntity> _entityMutator;
        private readonly IApiKeyReadRepository _readRepository;

        public ApiKeyWriteRepository(
            Task<Container> container,
            ICosmosEntityMutator<ApiKeyEntity> entityMutator,
            IApiKeyReadRepository readRepository
        )
        {
            _container = container;
            _entityMutator = entityMutator;
            _readRepository = readRepository;
        }

        public async Task CreateAsync(CreateApiKeyRequest request)
        {
            var entity = new ApiKeyEntity
            {
                Owner = request.Owner,
                Permissions = request.Permissions
            };

            await (await _container).CreateItemAsync(await _entityMutator.CreateMetadataAsync(entity, request.SharedWith));
        }

        public async Task UpdateAsync(string key, UpdateApiKeyRequest request)
        {
            var entity = await _readRepository.GetByKeyAsync(key);

            var updatedEntity = new ApiKeyEntity
            {
                Owner = request.Owner ?? entity.Owner,
                Permissions = request.Permissions ?? entity.Permissions
            };

            await (await _container).ReplaceItemAsync(
                await _entityMutator.UpdateMetadataAsync(updatedEntity, entity, request.SharedWith),
                key
            );
        }

        public async Task DeleteAsync(string idp, string key)
        {
            await (await _container).DeleteItemAsync<ApiKeyEntity>(key, new PartitionKey(idp));
        }
    }
}
