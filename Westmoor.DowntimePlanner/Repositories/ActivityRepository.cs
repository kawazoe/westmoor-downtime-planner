using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class ActivityRepository : IActivityRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityManipulator<ActivityEntity> _entityManipulator;

        public ActivityRepository(
            Task<Container> container,
            ICosmosEntityManipulator<ActivityEntity> entityManipulator
        )
        {
            _container = container;
            _entityManipulator = entityManipulator;
        }

        public async Task<ActivityEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<ActivityEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = _entityManipulator.DefaultPartitionKey }
                )
                .Where(_entityManipulator.GetScopeFilterPredicate())
                .OrderBy(a => a.Name)
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<ActivityEntity> GetByIdAsync(string id)
        {
            var entity = await (await _container)
                .ReadItemAsync<ActivityEntity>(id, _entityManipulator.DefaultPartitionKey);

            return _entityManipulator.GetScopeFilterPredicate().Compile().Invoke(entity)
                ? entity
                : null;
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

            await (await _container).CreateItemAsync(_entityManipulator.CreateMetadata(entity));
        }

        public async Task UpdateAsync(string id, UpdateActivityRequest request)
        {
            var entity = await GetByIdAsync(id);

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
                Costs = costs,
                SharedWith = request.SharedWith
            };

            await (await _container).ReplaceItemAsync(
                _entityManipulator.UpdateMetadata(updatedEntity, entity),
                id
            );
        }

        public async Task DeleteAsync(string id)
        {
            await (await _container).DeleteItemAsync<ActivityEntity>(id, _entityManipulator.DefaultPartitionKey);
        }
    }
}
