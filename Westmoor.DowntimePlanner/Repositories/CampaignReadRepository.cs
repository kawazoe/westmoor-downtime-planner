using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class CampaignReadRepository : ICampaignReadRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityFilter<CampaignEntity> _entityFilter;

        public CampaignReadRepository(
            Task<Container> container,
            ICosmosEntityFilter<CampaignEntity> entityFilter
        )
        {
            _container = container;
            _entityFilter = entityFilter;
        }

        public async Task<CampaignEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<CampaignEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = _entityFilter.DefaultPartitionKey }
                )
                .Where(_entityFilter.GetScopeFilterPredicate())
                .OrderBy(a => a.Name)
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<CampaignEntity> GetByIdAsync(string id)
        {
            var entity = await (await _container)
                .ReadItemAsync<CampaignEntity>(id, _entityFilter.DefaultPartitionKey);

            return _entityFilter.GetScopeFilterPredicate().Compile().Invoke(entity)
                ? entity
                : null;
        }
    }
}
