using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class DowntimeRepository : IDowntimeRepository
    {
        public async Task<DowntimeEntity[]> GetAllAsync()
        {
            throw new System.NotImplementedException();
        }

        public async Task<DowntimeEntity> GetByIdAsync(string id)
        {
            throw new System.NotImplementedException();
        }

        public async Task CreateAsync(CreateDowntimeRequest request)
        {
            throw new System.NotImplementedException();
        }

        public async Task UpdateAsync(string id, UpdateDowntimeRequest request)
        {
            throw new System.NotImplementedException();
        }

        public async Task DeleteAsync(string id)
        {
            throw new System.NotImplementedException();
        }
    }
}
