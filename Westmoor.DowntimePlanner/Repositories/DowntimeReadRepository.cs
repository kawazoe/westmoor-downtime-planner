using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class DowntimeReadRepository : IDowntimeReadRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityFilter<DowntimeEntity> _entityFilter;

        public DowntimeReadRepository(
            Task<Container> container,
            ICosmosEntityFilter<DowntimeEntity> entityFilter
        )
        {
            _container = container;
            _entityFilter = entityFilter;
        }

        public async Task<DowntimeEntity[]> GetAsync(Expression<Func<DowntimeEntity, bool>> predicate)
        {
            return await (await _container).GetItemLinqQueryable<DowntimeEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = _entityFilter.DefaultPartitionKey }
                )
                .Where(predicate)
                .Where(_entityFilter.GetScopeFilterPredicate())
                .OrderByDescending(d => d.CreatedOn)
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<DowntimeEntity> GetByIdAsync(string id)
        {
            var entity = await (await _container)
                .ReadItemAsync<DowntimeEntity>(id, _entityFilter.DefaultPartitionKey);

            return _entityFilter.GetScopeFilterPredicate().Compile().Invoke(entity)
                ? entity
                : null;
        }
    }
}
