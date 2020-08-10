using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;
using Westmoor.DowntimePlanner.Services;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class AspNetCoreCosmosEntityManipulator<TEntity> : ICosmosEntityManipulator<TEntity>
        where TEntity : CosmosEntity
    {
        private readonly IClock _clock;
        private readonly IUuidFactory _uuidFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserService _userService;

        public AspNetCoreCosmosEntityManipulator(
            IClock clock,
            IUuidFactory uuidFactory,
            IHttpContextAccessor httpContextAccessor,
            IUserService userService
        )
        {
            _clock = clock;
            _uuidFactory = uuidFactory;
            _httpContextAccessor = httpContextAccessor;
            _userService = userService;
        }

        public string DefaultPartitionKeyValue => typeof(TEntity).Name;
        public PartitionKey DefaultPartitionKey => new PartitionKey(DefaultPartitionKeyValue);

        public Expression<Func<TEntity, bool>> GetScopeFilterPredicate()
        {
            return _httpContextAccessor.HttpContext.User.GetMyContentPredicate<TEntity>();
        }

        public async Task<TEntity> CreateMetadataAsync(TEntity entity, string[] sharedWith)
        {
            var identity = _httpContextAccessor.HttpContext.User.Identity.Name;
            var ownershipIds = sharedWith.Prepend(identity);
            var entitySharedWith = entity.SharedWith ?? new SharedWithEntity[0];

            entity.Id = _uuidFactory.Create();
            entity.Idp = DefaultPartitionKeyValue;
            entity.SharedWith = (await CreateSharedWithEntitiesAsync(entitySharedWith, ownershipIds))
                .Concat(entitySharedWith)
                .Distinct(u => u.OwnershipId)
                .ToArray();
            entity.CreatedOn = _clock.UtcNow;
            entity.CreatedBy = identity;

            return entity;
        }

        public async Task<TEntity> UpdateMetadataAsync(TEntity updatedEntity, TEntity entity, string[] sharedWith)
        {
            var entitySharedWith = entity.SharedWith ?? new SharedWithEntity[0];

            updatedEntity.Id = entity.Id;
            updatedEntity.Idp = entity.Idp;
            updatedEntity.SharedWith = sharedWith == null
                ? entitySharedWith
                : await CreateSharedWithEntitiesAsync(entitySharedWith, sharedWith);
            updatedEntity.CreatedOn = entity.CreatedOn;
            updatedEntity.CreatedBy = entity.CreatedBy;
            updatedEntity.ModifiedOn = _clock.UtcNow;
            updatedEntity.ModifiedBy = _httpContextAccessor.HttpContext.User.Identity.Name;

            return updatedEntity;
        }

        private async Task<SharedWithEntity[]> CreateSharedWithEntitiesAsync(
            SharedWithEntity[] cache,
            IEnumerable<string> ownershipIds
        )
        {
            return await ownershipIds
                .Distinct()
                .ToAsyncEnumerable()
                .SelectAwait(async uid =>
                {
                    var existing = cache
                        .FirstOrDefault(s => s.OwnershipId == uid);

                    return existing ?? await CreateSharedWithEntityAsync(uid);
                })
                .Where(u => u != null)
                .ToArrayAsync();
        }

        private async Task<SharedWithEntity> CreateSharedWithEntityAsync(string ownershipId)
        {
            var user = await _userService.GetByIdAsync(ownershipId);

            return user == null
                ? null
                : new SharedWithEntity
                {
                    OwnershipId = ownershipId,
                    Picture = user.Picture,
                    Username = user.Username,
                    Email = user.Email,
                    Name = user.Name
                };
        }
    }
}
