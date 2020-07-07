using System;
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
        private readonly IClock _clock;
        private readonly Task<Container> _container;

        private const string KindKeyValue = nameof(ApiKeyEntity);
        private static PartitionKey KindKey => new PartitionKey(KindKeyValue);

        public ApiKeyRepository(IClock clock, Task<Container> container)
        {
            _clock = clock;
            _container = container;
        }

        public async Task<ApiKeyEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<ApiKeyEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = KindKey }
                )
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<ApiKeyEntity> GetByKeyAsync(string key)
        {
            return await (await _container).ReadItemAsync<ApiKeyEntity>(key, KindKey);
        }

        public async Task CreateAsync(CreateApiKeyRequest request)
        {
            await (await _container).CreateItemAsync(
                new ApiKeyEntity
                {
                    Id = Guid.NewGuid().ToString(),
                    Idp = KindKeyValue,
                    Owner = request.Owner,
                    Roles = request.Roles,
                    CreatedOn = _clock.UtcNow
                }
            );
        }

        public async Task UpdateAsync(string key, UpdateApiKeyRequest request)
        {
            var entity = await GetByKeyAsync(key);

            await (await _container).ReplaceItemAsync(
                new ApiKeyEntity
                {
                    Id = entity.Id,
                    Idp = entity.Idp,
                    Owner = request.Owner ?? entity.Owner,
                    Roles = request.Roles ?? entity.Roles,
                    CreatedOn = entity.CreatedOn,
                    ModifiedOn = _clock.UtcNow
                },
                key
            );
        }

        public async Task DeleteAsync(string key)
        {
            await (await _container).DeleteItemAsync<ApiKeyEntity>(key, KindKey);
        }
    }
}
