using System.Linq;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Services
{
    public class DowntimeService : IDowntimeService
    {
        private readonly IDowntimeReadRepository _readRepository;
        private readonly IDowntimeWriteRepository _writeRepository;

        public DowntimeService(
            IDowntimeReadRepository readRepository,
            IDowntimeWriteRepository writeRepository
        )
        {
            _readRepository = readRepository;
            _writeRepository = writeRepository;
        }

        public async Task<DowntimeEntity[]> GetCurrentAsync() =>
            await _readRepository.GetAsync(d => d.Costs.Any(c => c.Value < c.Goal));

        public async Task<DowntimeEntity[]> GetCompletedAsync() =>
            await _readRepository.GetAsync(d => !d.Costs.Any(c => c.Value < c.Goal));

        public async Task<DowntimeEntity> GetByIdAsync(string id) =>
            await _readRepository.GetByIdAsync(id);

        public async Task CreateAsync(CreateDowntimeRequest request) =>
            await _writeRepository.CreateAsync(request);

        public async Task UpdateAsync(string id, UpdateDowntimeRequest request) =>
            await _writeRepository.UpdateAsync(id, request);

        public async Task AdvanceAsync(string id, AdvanceDowntimeRequest request) =>
            await _writeRepository.AdvanceAsync(id, request);

        public async Task AdvanceBatchAsync(AdvanceDowntimeBatchRequest request) =>
            await _writeRepository.AdvanceBatchAsync(request);

        public async Task DeleteAsync(string idp, string id) =>
            await _writeRepository.DeleteAsync(idp, id);
    }
}
