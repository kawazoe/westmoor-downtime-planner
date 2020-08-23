using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class ApiKeyReadRepository : IApiKeyReadRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityFilter<ApiKeyEntity> _entityFilter;

        public ApiKeyReadRepository(
            Task<Container> container,
            ICosmosEntityFilter<ApiKeyEntity> entityFilter
        )
        {
            _container = container;
            _entityFilter = entityFilter;
        }

        public async Task<ApiKeyEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<ApiKeyEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = _entityFilter.DefaultPartitionKey }
                )
                .Where(_entityFilter.GetScopeFilterPredicate())
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<ApiKeyEntity> GetByKeyAsync(string key)
        {
            var entity = await (await _container)
                .ReadItemAsync<ApiKeyEntity>(key, _entityFilter.DefaultPartitionKey);

            return _entityFilter.GetScopeFilterPredicate().Compile().Invoke(entity)
                ? entity
                : null;
        }
    }
}
