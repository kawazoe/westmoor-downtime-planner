using System;
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
        private readonly IClock _clock;
        private readonly Task<Container> _container;

        private const string KindKeyValue = nameof(ActivityEntity);
        private static PartitionKey KindKey => new PartitionKey(KindKeyValue);

        public ActivityRepository(IClock clock, Task<Container> container)
        {
            _clock = clock;
            _container = container;
        }

        public async Task<ActivityEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<ActivityEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = KindKey }
                )
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<ActivityEntity> GetByIdAsync(string id)
        {
            return await (await _container).ReadItemAsync<ActivityEntity>(id, KindKey);
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

            await (await _container).CreateItemAsync(
                new ActivityEntity
                {
                    Id = Guid.NewGuid().ToString(),
                    Idp = KindKeyValue,
                    Name = request.Name,
                    DescriptionMarkdown = request.DescriptionMarkdown,
                    ComplicationMarkdown = request.ComplicationMarkdown,
                    Costs = costs,
                    CreatedOn = _clock.UtcNow
                }
            );
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

            await (await _container).ReplaceItemAsync(
                new ActivityEntity
                {
                    Id = entity.Id,
                    Idp = entity.Idp,
                    Name = request.Name,
                    DescriptionMarkdown = request.DescriptionMarkdown,
                    ComplicationMarkdown = request.ComplicationMarkdown,
                    Costs = costs,
                    CreatedOn = entity.CreatedOn,
                    ModifiedOn = _clock.UtcNow
                },
                id
            );
        }

        public async Task DeleteAsync(string id)
        {
            await (await _container).DeleteItemAsync<ActivityEntity>(id, KindKey);
        }
    }
}
