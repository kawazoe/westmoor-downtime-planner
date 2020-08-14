using System.Linq;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Services
{
    public class DowntimeService : IDowntimeService
    {
        private readonly IDowntimeRepository _repository;

        public DowntimeService(IDowntimeRepository repository)
        {
            _repository = repository;
        }

        public async Task<DowntimeEntity[]> GetCurrentAsync() =>
            await _repository.GetAsync(d => d.Costs.Any(c => c.Value < c.Goal));

        public async Task<DowntimeEntity[]> GetCompletedAsync() =>
            await _repository.GetAsync(d => !d.Costs.Any(c => c.Value < c.Goal));

        public async Task<DowntimeEntity> GetByIdAsync(string id) =>
            await _repository.GetByIdAsync(id);

        public async Task CreateAsync(CreateDowntimeRequest request) =>
            await _repository.CreateAsync(request);

        public async Task UpdateAsync(string id, UpdateDowntimeRequest request) =>
            await _repository.UpdateAsync(id, request);

        public async Task AdvanceAsync(string id, AdvanceDowntimeRequest request) =>
            await _repository.AdvanceAsync(id, request);

        public async Task AdvanceBatchAsync(AdvanceDowntimeBatchRequest request) =>
            await _repository.AdvanceBatchAsync(request);

        public async Task DeleteAsync(string id) =>
            await _repository.DeleteAsync(id);
    }
}
