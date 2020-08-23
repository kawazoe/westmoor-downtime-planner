using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class ActivityWriteRepository : IActivityWriteRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityMutator<ActivityEntity> _entityMutator;
        private readonly IActivityReadRepository _readRepository;

        public ActivityWriteRepository(
            Task<Container> container,
            ICosmosEntityMutator<ActivityEntity> entityMutator,
            IActivityReadRepository readRepository
        )
        {
            _container = container;
            _entityMutator = entityMutator;
            _readRepository = readRepository;
        }

        public async Task CreateAsync(CreateActivityRequest request)
        {
            var costs = request.Costs
                .Select(c =>
                {
                    var parameters = c.Parameters
                        .Select(p => new ActivityParameterEntity
                        {
                            VariableName = p.VariableName,
                            Description = p.Description
                        })
                        .ToArray();

                    return new ActivityCostEntity
                    {
                        Kind = c.Kind,
                        JexlExpression = c.JexlExpression,
                        Parameters = parameters
                    };
                })
                .ToArray();

            var entity = new ActivityEntity
            {
                Name = request.Name,
                DescriptionMarkdown = request.DescriptionMarkdown,
                ComplicationMarkdown = request.ComplicationMarkdown,
                Costs = costs
            };

            await (await _container).CreateItemAsync(await _entityMutator.CreateMetadataAsync(entity, request.SharedWith));
        }

        public async Task UpdateAsync(string id, UpdateActivityRequest request)
        {
            var entity = await _readRepository.GetByIdAsync(id);

            var costs = request.Costs
                .Select(c =>
                {
                    var parameters = c.Parameters
                        .Select(p => new ActivityParameterEntity
                        {
                            VariableName = p.VariableName,
                            Description = p.Description
                        })
                        .ToArray();

                    return new ActivityCostEntity
                    {
                        Kind = c.Kind,
                        JexlExpression = c.JexlExpression,
                        Parameters = parameters
                    };
                })
                .ToArray();

            var updatedEntity = new ActivityEntity
            {
                Name = request.Name,
                DescriptionMarkdown = request.DescriptionMarkdown,
                ComplicationMarkdown = request.ComplicationMarkdown,
                Costs = costs
            };

            await (await _container).ReplaceItemAsync(
                await _entityMutator.UpdateMetadataAsync(updatedEntity, entity, request.SharedWith),
                id
            );
        }

        public async Task DeleteAsync(string idp, string id)
        {
            await (await _container).DeleteItemAsync<ActivityEntity>(id, new PartitionKey(idp));
        }
    }
}
