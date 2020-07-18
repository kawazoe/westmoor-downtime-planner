using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class ApiKeyRepository : IApiKeyRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityManipulator<ApiKeyEntity> _entityManipulator;

        public ApiKeyRepository(
            Task<Container> container,
            ICosmosEntityManipulator<ApiKeyEntity> entityManipulator
        )
        {
            _container = container;
            _entityManipulator = entityManipulator;
        }

        public async Task<ApiKeyEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<ApiKeyEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = _entityManipulator.DefaultPartitionKey }
                )
                .Where(_entityManipulator.GetScopeFilterPredicate())
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<ApiKeyEntity> GetByKeyAsync(string key)
        {
            var entity = await (await _container)
                .ReadItemAsync<ApiKeyEntity>(key, _entityManipulator.DefaultPartitionKey);

            return _entityManipulator.GetScopeFilterPredicate().Compile().Invoke(entity)
                ? entity
                : null;
        }

        public async Task CreateAsync(CreateApiKeyRequest request)
        {
            var entity = new ApiKeyEntity
            {
                Owner = request.Owner,
                Roles = request.Roles
            };

            await (await _container).CreateItemAsync(_entityManipulator.CreateMetadata(entity));
        }

        public async Task UpdateAsync(string key, UpdateApiKeyRequest request)
        {
            var entity = await GetByKeyAsync(key);

            var updatedEntity = new ApiKeyEntity
            {
                Owner = request.Owner ?? entity.Owner,
                Roles = request.Roles ?? entity.Roles
            };

            await (await _container).ReplaceItemAsync(
                _entityManipulator.UpdateMetadata(updatedEntity, entity),
                key
            );
        }

        public async Task DeleteAsync(string key)
        {
            await (await _container).DeleteItemAsync<ApiKeyEntity>(key, _entityManipulator.DefaultPartitionKey);
        }
    }
}
