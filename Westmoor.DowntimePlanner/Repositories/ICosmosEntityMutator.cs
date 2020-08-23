using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface ICosmosEntityMutator<TEntity> where TEntity : CosmosEntityBase
    {
        Task<TEntity> CreateMetadataAsync(TEntity entity, CreateSharedWithRequest[] sharedWith);
        Task<TEntity> UpdateMetadataAsync(TEntity updatedEntity, TEntity entity, UpdateSharedWithRequest[] sharedWith);
    }
}
