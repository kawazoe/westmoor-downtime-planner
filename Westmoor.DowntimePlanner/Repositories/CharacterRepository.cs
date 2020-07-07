using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class CharacterRepository : ICharacterRepository
    {
        private readonly IClock _clock;
        private readonly Task<Container> _container;

        private const string KindKeyValue = nameof(CharacterEntity);
        private static PartitionKey KindKey => new PartitionKey(KindKeyValue);

        public CharacterRepository(IClock clock, Task<Container> container)
        {
            _clock = clock;
            _container = container;
        }

        public async Task<CharacterEntity[]> GetAllAsync()
        {
            return await (await _container).GetItemLinqQueryable<CharacterEntity>(
                    requestOptions: new QueryRequestOptions { PartitionKey = KindKey }
                )
                .ToAsyncEnumerable()
                .ToArrayAsync();
        }

        public async Task<CharacterEntity> GetByIdAsync(string id)
        {
            return await (await _container).ReadItemAsync<CharacterEntity>(id, KindKey);
        }

        public async Task CreateAsync(CreateCharacterRequest request)
        {
            await (await _container).CreateItemAsync(
                new CharacterEntity
                {
                    Id = Guid.NewGuid().ToString(),
                    Idp = KindKeyValue,
                    PlayerFullName = request.PlayerFullName,
                    CharacterFullName = request.CharacterFullName,
                    AccruedDowntimeDays = 0,
                    CreatedOn = _clock.UtcNow
                }
            );
        }

        public async Task UpdateAsync(string id, UpdateCharacterRequest request)
        {
            var entity = await GetByIdAsync(id);

            await (await _container).ReplaceItemAsync(
                new CharacterEntity
                {
                    Id = entity.Id,
                    Idp = entity.Idp,
                    PlayerFullName = request.PlayerFullName,
                    CharacterFullName = request.CharacterFullName,
                    AccruedDowntimeDays = request.AccruedDowntimeDays,
                    CreatedOn = entity.CreatedOn,
                    ModifiedOn = _clock.UtcNow
                },
                id
            );
        }

        public async Task DeleteAsync(string id)
        {
            await (await _container).DeleteItemAsync<CharacterEntity>(id, KindKey);
        }
    }
}
