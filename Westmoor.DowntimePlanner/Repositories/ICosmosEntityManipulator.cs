using System;
using System.Linq.Expressions;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface ICosmosEntityManipulator<TEntity>
        where TEntity : CosmosEntity
    {
        string DefaultPartitionKeyValue { get; }
        PartitionKey DefaultPartitionKey { get; }
        Expression<Func<TEntity, bool>> GetScopeFilterPredicate();
        TEntity CreateMetadata(TEntity entity);
        TEntity UpdateMetadata(TEntity updatedEntity, TEntity entity);
    }
}
