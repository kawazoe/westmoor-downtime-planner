using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class CharacterReadRepository : ICharacterReadRepository
    {
        private readonly Task<Container> _container;
        private readonly ICosmosEntityFilter<CharacterEntity> _entityFilter;

        public CharacterReadRepository(
            Task<Container> container,
            ICosmosEntityFilter<CharacterEntity> entityFilter
        )
        {
            _container = container;
            _entityFilter = entityFilter;
        }

        public async Task<CharacterEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<CharacterEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = _entityFilter.DefaultPartitionKey }
                )
                .Where(_entityFilter.GetScopeFilterPredicate())
                .OrderBy(c => c.PlayerFullName)
                .ThenBy(c => c.CharacterFullName)
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<CharacterEntity> GetByIdAsync(string id)
        {
            var entity = await (await _container)
                .ReadItemAsync<CharacterEntity>(id, _entityFilter.DefaultPartitionKey);

            return _entityFilter.GetScopeFilterPredicate().Compile().Invoke(entity)
                ? entity
                : null;
        }
    }
}
