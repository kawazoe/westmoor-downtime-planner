using System.Linq;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Services
{
    public class DowntimeService : IDowntimeService
    {
        private readonly IDowntimeRepository _repository;

        public DowntimeService(IDowntimeRepository repository)
        {
            _repository = repository;
        }

        public async Task<DowntimeResponse[]> GetAllAsync() =>
            (await _repository.GetAllAsync())
                .Select(ToResponse)
                .ToArray();

        public async Task CreateAsync(CreateDowntimeRequest request) =>
            await _repository.CreateAsync(request);

        public async Task UpdateAsync(string id, UpdateDowntimeRequest request) =>
            await _repository.UpdateAsync(id, request);

        public async Task DeleteAsync(string id) =>
            await _repository.DeleteAsync(id);

        private DowntimeResponse ToResponse(DowntimeEntity entity) =>
            new DowntimeResponse();
    }
}
