using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Services
{
    public class CampaignService : ICampaignService
    {
        private readonly ICampaignRepository _repository;

        public CampaignService(ICampaignRepository repository)
        {
            _repository = repository;
        }

        public async Task<CampaignEntity[]> GetAllAsync() =>
            await _repository.GetAllAsync();

        public async Task<CampaignEntity> GetByIdAsync(string id) =>
            await _repository.GetByIdAsync(id);

        public async Task CreateAsync(CreateCampaignRequest request) =>
            await _repository.CreateAsync(request);

        public async Task UpdateAsync(string id, UpdateCampaignRequest request) =>
            await _repository.UpdateAsync(id, request);

        public async Task DeleteAsync(string id) =>
            await _repository.DeleteAsync(id);
    }
}
