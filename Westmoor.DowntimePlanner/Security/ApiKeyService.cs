using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Security
{
    public class ApiKeyService : IApiKeyService
    {
        private readonly IApiKeyReadRepository _readRepository;
        private readonly IApiKeyWriteRepository _writeRepository;

        public ApiKeyService(
            IApiKeyReadRepository readRepository,
            IApiKeyWriteRepository writeRepository
        )
        {
            _readRepository = readRepository;
            _writeRepository = writeRepository;
        }

        public async Task<ApiKeyEntity[]> GetAllAsync() =>
            await _readRepository.GetAllAsync();

        public async Task<ApiKeyEntity> GetByKeyAsync(string key) =>
            await _readRepository.GetByKeyAsync(key);

        public async Task CreateAsync(CreateApiKeyRequest request) =>
            await _writeRepository.CreateAsync(request);

        public async Task UpdateAsync(string key, UpdateApiKeyRequest request) =>
            await _writeRepository.UpdateAsync(key, request);

        public async Task RevokeAsync(string idp, string key) =>
            await _writeRepository.DeleteAsync(idp, key);
    }
}
