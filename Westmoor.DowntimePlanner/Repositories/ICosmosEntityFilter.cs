using System;
using System.Linq.Expressions;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface ICosmosEntityFilter<TEntity> where TEntity : CosmosEntityBase
    {
        PartitionKey DefaultPartitionKey { get; }
        Expression<Func<TEntity, bool>> GetScopeFilterPredicate();
    }
}