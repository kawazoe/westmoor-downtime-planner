using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class CampaignWriteRepository : ICampaignWriteRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityMutator<CampaignEntity> _entityMutator;
        private readonly ICampaignReadRepository _readRepository;

        public CampaignWriteRepository(
            Task<Container> container,
            ICosmosEntityMutator<CampaignEntity> entityMutator,
            ICampaignReadRepository readRepository
        )
        {
            _container = container;
            _entityMutator = entityMutator;
            _readRepository = readRepository;
        }

        public async Task CreateAsync(CreateCampaignRequest request)
        {
            var entity = new CampaignEntity
            {
                Name = request.Name
            };

            await (await _container).CreateItemAsync(await _entityMutator.CreateMetadataAsync(entity, request.SharedWith));
        }

        public async Task UpdateAsync(string id, UpdateCampaignRequest request)
        {
            var entity = await _readRepository.GetByIdAsync(id);

            var updatedEntity = new CampaignEntity
            {
                Name = request.Name
            };

            await (await _container).ReplaceItemAsync(
                await _entityMutator.UpdateMetadataAsync(updatedEntity, entity, request.SharedWith),
                id
            );
        }

        public async Task DeleteAsync(string idp, string id)
        {
            await (await _container).DeleteItemAsync<CampaignEntity>(id, new PartitionKey(idp));
        }
    }
}
