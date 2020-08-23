using System.Collections.Generic;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Repositories
{
    public interface IShareWithFactory
    {
        Task<SharedWithEntity[]> CreateEntitiesAsync(
            SharedWithEntity[] existing,
            IEnumerable<string> userIds,
            IEnumerable<string> tenantIds
        );
    }
}
