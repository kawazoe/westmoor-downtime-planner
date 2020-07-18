using System;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class AspNetCoreCosmosEntityManipulator<TEntity> : ICosmosEntityManipulator<TEntity>
        where TEntity : CosmosEntity
    {
        private readonly IClock _clock;
        private readonly IUuidFactory _uuidFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AspNetCoreCosmosEntityManipulator(
            IClock clock,
            IUuidFactory uuidFactory,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _clock = clock;
            _uuidFactory = uuidFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        public string DefaultPartitionKeyValue => typeof(TEntity).Name;
        public PartitionKey DefaultPartitionKey => new PartitionKey(DefaultPartitionKeyValue);

        public Expression<Func<TEntity, bool>> GetScopeFilterPredicate()
        {
            return _httpContextAccessor.HttpContext.User.GetMyContentPredicate<TEntity>();
        }

        public TEntity CreateMetadata(TEntity entity)
        {
            var identity = _httpContextAccessor.HttpContext.User.Identity.Name;

            entity.Id = _uuidFactory.Create();
            entity.Idp = DefaultPartitionKeyValue;
            entity.SharedWith = new[]
            {
                entity.CreatedBy
            };
            entity.CreatedOn = _clock.UtcNow;
            entity.CreatedBy = identity;
            entity.SharedWith = entity.SharedWith
                .Prepend(identity)
                .ToArray();

            return entity;
        }

        public TEntity UpdateMetadata(TEntity updatedEntity, TEntity entity)
        {
            updatedEntity.Id = entity.Id;
            updatedEntity.Idp = entity.Idp;
            updatedEntity.SharedWith = entity.SharedWith;
            updatedEntity.CreatedOn = entity.CreatedOn;
            updatedEntity.CreatedBy = entity.CreatedBy;
            updatedEntity.ModifiedOn = _clock.UtcNow;
            updatedEntity.ModifiedBy = _httpContextAccessor.HttpContext.User.Identity.Name;

            return updatedEntity;
        }
    }
}
