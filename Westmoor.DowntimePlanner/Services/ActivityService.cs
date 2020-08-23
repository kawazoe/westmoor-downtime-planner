using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Services
{
    public class ActivityService : IActivityService
    {
        private readonly IActivityReadRepository _readRepository;
        private readonly IActivityWriteRepository _writeRepository;

        public ActivityService(
            IActivityReadRepository readRepository,
            IActivityWriteRepository writeRepository
        )
        {
            _readRepository = readRepository;
            _writeRepository = writeRepository;
        }

        public async Task<ActivityEntity[]> GetAllAsync() =>
            await _readRepository.GetAllAsync();

        public async Task<ActivityEntity> GetByIdAsync(string id) =>
            await _readRepository.GetByIdAsync(id);

        public async Task CreateAsync(CreateActivityRequest request) =>
            await _writeRepository.CreateAsync(request);

        public async Task UpdateAsync(string id, UpdateActivityRequest request) =>
            await _writeRepository.UpdateAsync(id, request);

        public async Task DeleteAsync(string idp, string id) =>
            await _writeRepository.DeleteAsync(idp, id);
    }
}
