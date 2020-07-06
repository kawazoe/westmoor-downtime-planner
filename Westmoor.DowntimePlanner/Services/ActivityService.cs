using System.Linq;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Services
{
    public class ActivityService : IActivityService
    {
        private readonly IActivityRepository _repository;

        public ActivityService(IActivityRepository repository)
        {
            _repository = repository;
        }

        public async Task<ActivityResponse[]> GetAllAsync() =>
            (await _repository.GetAllAsync())
                .Select(ToResponse)
                .ToArray();

        public async Task CreateAsync(CreateActivityRequest request) =>
            await _repository.CreateAsync(request);

        public async Task UpdateAsync(string id, UpdateActivityRequest request) =>
            await _repository.UpdateAsync(id, request);

        public async Task DeleteAsync(string id) =>
            await _repository.DeleteAsync(id);

        private ActivityResponse ToResponse(ActivityEntity entity) =>
            new ActivityResponse();
    }
}
