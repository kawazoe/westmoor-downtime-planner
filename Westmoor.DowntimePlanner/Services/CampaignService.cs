using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Services
{
    public class CampaignService : ICampaignService
    {
        private readonly ICampaignReadRepository _readRepository;
        private readonly ICampaignWriteRepository _writeRepository;

        public CampaignService(
            ICampaignReadRepository readRepository,
            ICampaignWriteRepository writeRepository
        )
        {
            _readRepository = readRepository;
            _writeRepository = writeRepository;
        }

        public async Task<CampaignEntity[]> GetAllAsync() =>
            await _readRepository.GetAllAsync();

        public async Task<CampaignEntity> GetByIdAsync(string id) =>
            await _readRepository.GetByIdAsync(id);

        public async Task CreateAsync(CreateCampaignRequest request) =>
            await _writeRepository.CreateAsync(request);

        public async Task UpdateAsync(string id, UpdateCampaignRequest request) =>
            await _writeRepository.UpdateAsync(id, request);

        public async Task DeleteAsync(string idp, string id) =>
            await _writeRepository.DeleteAsync(idp, id);
    }
}
