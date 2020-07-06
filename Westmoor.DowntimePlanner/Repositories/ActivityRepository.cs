using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class ActivityRepository : IActivityRepository
    {
        public async Task<ActivityEntity[]> GetAllAsync()
        {
            throw new System.NotImplementedException();
        }

        public async Task<ActivityEntity> GetByIdAsync(string id)
        {
            throw new System.NotImplementedException();
        }

        public async Task CreateAsync(CreateActivityRequest request)
        {
            throw new System.NotImplementedException();
        }

        public async Task UpdateAsync(string id, UpdateActivityRequest request)
        {
            throw new System.NotImplementedException();
        }

        public async Task DeleteAsync(string id)
        {
            throw new System.NotImplementedException();
        }
    }
}
