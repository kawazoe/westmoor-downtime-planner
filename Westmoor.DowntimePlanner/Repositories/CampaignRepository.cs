using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class CampaignRepository : ICampaignRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityManipulator<CampaignEntity> _entityManipulator;

        public CampaignRepository(
            Task<Container> container,
            ICosmosEntityManipulator<CampaignEntity> entityManipulator
        )
        {
            _container = container;
            _entityManipulator = entityManipulator;
        }

        public async Task<CampaignEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<CampaignEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = _entityManipulator.DefaultPartitionKey }
                )
                .Where(_entityManipulator.GetScopeFilterPredicate())
                .OrderBy(a => a.Name)
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<CampaignEntity> GetByIdAsync(string id)
        {
            var entity = await (await _container)
                .ReadItemAsync<CampaignEntity>(id, _entityManipulator.DefaultPartitionKey);

            return _entityManipulator.GetScopeFilterPredicate().Compile().Invoke(entity)
                ? entity
                : null;
        }

        public async Task CreateAsync(CreateCampaignRequest request)
        {
            var entity = new CampaignEntity
            {
                Name = request.Name
            };

            await (await _container).CreateItemAsync(await _entityManipulator.CreateMetadataAsync(entity, request.SharedWith));
        }

        public async Task UpdateAsync(string id, UpdateCampaignRequest request)
        {
            var entity = await GetByIdAsync(id);

            var updatedEntity = new CampaignEntity
            {
                Name = request.Name
            };

            await (await _container).ReplaceItemAsync(
                await _entityManipulator.UpdateMetadataAsync(updatedEntity, entity, request.SharedWith),
                id
            );
        }

        public async Task DeleteAsync(string id)
        {
            await (await _container).DeleteItemAsync<CampaignEntity>(id, _entityManipulator.DefaultPartitionKey);
        }
    }
}
