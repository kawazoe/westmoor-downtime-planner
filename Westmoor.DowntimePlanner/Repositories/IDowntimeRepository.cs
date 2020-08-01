using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IDowntimeRepository
    {
        Task<DowntimeEntity[]> GetAsync(Expression<Func<DowntimeEntity, bool>> predicate);
        Task<DowntimeEntity> GetByIdAsync(string id);
        Task CreateAsync(CreateDowntimeRequest request);
        Task UpdateAsync(string id, UpdateDowntimeRequest request);
        Task AdvanceAsync(string id, AdvanceDowntimeRequest request);
        Task AdvanceBatchAsync(AdvanceDowntimeBatchRequest request);
        Task DeleteAsync(string id);
    }
}
