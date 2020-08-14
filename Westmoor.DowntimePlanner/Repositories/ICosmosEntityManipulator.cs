using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface ICosmosEntityManipulator<TEntity>
        where TEntity : CosmosEntityBase
    {
        string DefaultPartitionKeyValue { get; }
        PartitionKey DefaultPartitionKey { get; }
        Expression<Func<TEntity, bool>> GetScopeFilterPredicate();
        Task<TEntity> CreateMetadataAsync(TEntity entity, string[] sharedWith);
        Task<TEntity> UpdateMetadataAsync(TEntity updatedEntity, TEntity entity, string[] sharedWith);
    }
}
