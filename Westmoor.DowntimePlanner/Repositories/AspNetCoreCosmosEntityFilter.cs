using System;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;
using Westmoor.DowntimePlanner.Security;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class AspNetCoreCosmosEntityFilter<TEntity> : ICosmosEntityFilter<TEntity>
        where TEntity : CosmosEntityBase
    {
        private static string DefaultPartitionKeyValue => typeof(TEntity).Name;

        private readonly IIdentityAccessor _identityAccessor;
        private readonly ITenantAccessor _tenantAccessor;

        public AspNetCoreCosmosEntityFilter(
            IIdentityAccessor identityAccessor,
            ITenantAccessor tenantAccessor
        )
        {
            _identityAccessor = identityAccessor;
            _tenantAccessor = tenantAccessor;
        }

        public PartitionKey DefaultPartitionKey => new PartitionKey(DefaultPartitionKeyValue);

        public Expression<Func<TEntity, bool>> GetScopeFilterPredicate()
        {
            var identity = _identityAccessor.Identity;
            var activeTenants = _tenantAccessor.ActiveTenants
                .Race(_tenantAccessor.AccessibleTenants)
                .ToArray();

            return e =>
                e.SharedWith.Any(u => u.OwnershipId == identity) &&
                e.SharedWith.Any(u => activeTenants.Contains(u.OwnershipId));
        }
    }
}
