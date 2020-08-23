using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IDowntimeReadRepository
    {
        Task<DowntimeEntity[]> GetAsync(Expression<Func<DowntimeEntity, bool>> predicate);
        Task<DowntimeEntity> GetByIdAsync(string id);
    }
}