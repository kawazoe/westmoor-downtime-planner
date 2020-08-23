using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class ShareWithFactory : IShareWithFactory
    {
        private readonly IAuth0ApiUserReadRepository _userRepository;
        private readonly ICampaignReadRepository _campaignRepository;

        public ShareWithFactory(
            IAuth0ApiUserReadRepository userRepository,
            ICampaignReadRepository campaignRepository
        )
        {
            _userRepository = userRepository;
            _campaignRepository = campaignRepository;
        }

        public async Task<SharedWithEntity[]> CreateEntitiesAsync(
            SharedWithEntity[] existing,
            IEnumerable<string> userIds,
            IEnumerable<string> tenantIds
        )
        {
            IAsyncEnumerable<SharedWithEntity> RecycleOrCreateEntities(
                IEnumerable<string> ids,
                Func<string, Task<SharedWithEntity>> factory
            ) => ids
                .Distinct()
                .ToAsyncEnumerable()
                .SelectAwait(async id => existing
                                             .FirstOrDefault(s => s.OwnershipId == id)
                                         ?? await factory.Invoke(id)
                )
                .Where(u => u != null);

            return await RecycleOrCreateEntities(userIds, ShareWithUserAsync)
                .Concat(RecycleOrCreateEntities(tenantIds, ShareWithTenantAsync))
                .ToArrayAsync();
        }

        private async Task<SharedWithEntity> ShareWithUserAsync(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            return user.MapOrDefault(u => new SharedWithEntity
            {
                Kind = SharedWithKind.User,
                OwnershipId = id,
                Picture = u.Picture,
                Email = u.Email,
                Name = u.Name
            });
        }

        private async Task<SharedWithEntity> ShareWithTenantAsync(string id)
        {
            var campaign = await _campaignRepository.GetByIdAsync(id);

            return campaign.MapOrDefault(c => new SharedWithEntity
            {
                Kind = SharedWithKind.Tenant,
                OwnershipId = id,
                Picture = null,
                Email = null,
                Name = c.Name
            });
        }
    }
}
