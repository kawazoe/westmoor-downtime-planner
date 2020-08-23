using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class ActivityReadRepository : IActivityReadRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityFilter<ActivityEntity> _entityFilter;

        public ActivityReadRepository(
            Task<Container> container,
            ICosmosEntityFilter<ActivityEntity> entityFilter
        )
        {
            _container = container;
            _entityFilter = entityFilter;
        }

        public async Task<ActivityEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<ActivityEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = _entityFilter.DefaultPartitionKey }
                )
                .Where(_entityFilter.GetScopeFilterPredicate())
                .OrderBy(a => a.Name)
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<ActivityEntity> GetByIdAsync(string id)
        {
            var entity = await (await _container)
                .ReadItemAsync<ActivityEntity>(id, _entityFilter.DefaultPartitionKey);

            return _entityFilter.GetScopeFilterPredicate().Compile().Invoke(entity)
                ? entity
                : null;
        }
    }
}
