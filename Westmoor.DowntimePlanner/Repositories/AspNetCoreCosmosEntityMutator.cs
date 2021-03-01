using System.Linq;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Security;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class AspNetCoreCosmosEntityMutator<TEntity> : ICosmosEntityMutator<TEntity>
        where TEntity : CosmosEntityBase
    {
        private static string DefaultPartitionKeyValue => typeof(TEntity).Name;

        private readonly IClock _clock;
        private readonly IUuidFactory _uuidFactory;
        private readonly IIdentityAccessor _identityAccessor;
        private readonly ITenantAccessor _tenantAccessor;
        private readonly IShareWithFactory _shareWithFactory;

        public AspNetCoreCosmosEntityMutator(
            IClock clock,
            IUuidFactory uuidFactory,
            IIdentityAccessor identityAccessor,
            ITenantAccessor tenantAccessor,
            IShareWithFactory shareWithFactory
        )
        {
            _clock = clock;
            _uuidFactory = uuidFactory;
            _identityAccessor = identityAccessor;
            _tenantAccessor = tenantAccessor;
            _shareWithFactory = shareWithFactory;
        }

        public async Task<TEntity> CreateMetadataAsync(TEntity entity, CreateSharedWithRequest[] sharedWith)
        {
            var identity = _identityAccessor.Identity;

            var userIds = sharedWith
                .Where(u => u.Kind == SharedWithKind.User)
                .Select(u => u.OwnershipId)
                .Prepend(identity);
            var tenantIds = sharedWith
                .Where(u => u.Kind == SharedWithKind.Tenant)
                .Select(u => u.OwnershipId)
                .ConcatRight(_tenantAccessor.ActiveTenants)
                .Race(_tenantAccessor.AccessibleTenants);

            var entitySharedWith = entity.SharedWith ?? new SharedWithEntity[0];

            entity.Id = _uuidFactory.Create();
            entity.Idp = DefaultPartitionKeyValue;
            entity.SharedWith =
                (await _shareWithFactory.CreateEntitiesAsync(
                    entitySharedWith,
                    userIds,
                    tenantIds
                ))
                .Concat(entitySharedWith)
                .Distinct(u => u.OwnershipId)
                .ToArray();
            entity.CreatedOn = _clock.UtcNow;
            entity.CreatedBy = identity;

            return entity;
        }

        public async Task<TEntity> UpdateMetadataAsync(
            TEntity updatedEntity,
            TEntity entity,
            UpdateSharedWithRequest[] sharedWith
        )
        {
            var entitySharedWith = entity.SharedWith ?? new SharedWithEntity[0];

            updatedEntity.Id = entity.Id;
            updatedEntity.Idp = entity.Idp;
            updatedEntity.SharedWith = sharedWith == null
                ? entitySharedWith
                : await _shareWithFactory.CreateEntitiesAsync(
                    entitySharedWith,
                    sharedWith
                        .Where(u => u.Kind == SharedWithKind.User)
                        .Select(u => u.OwnershipId),
                    sharedWith
                        .Where(u => u.Kind == SharedWithKind.Tenant)
                        .Select(u => u.OwnershipId)
                );
            updatedEntity.CreatedOn = entity.CreatedOn;
            updatedEntity.CreatedBy = entity.CreatedBy;
            updatedEntity.ModifiedOn = _clock.UtcNow;
            updatedEntity.ModifiedBy = _identityAccessor.Identity;

            return updatedEntity;
        }
    }
}
