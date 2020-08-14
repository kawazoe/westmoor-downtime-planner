using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Security
{
    public class ApiKeyService : IApiKeyService
    {
        private readonly IApiKeyRepository _repository;

        public ApiKeyService(IApiKeyRepository repository)
        {
            _repository = repository;
        }

        public async Task<ApiKeyEntity[]> GetAllAsync() =>
            await _repository.GetAllAsync();

        public async Task<ApiKeyEntity> GetByKeyAsync(string key) =>
            await _repository.GetByKeyAsync(key);

        public async Task CreateAsync(CreateApiKeyRequest request) =>
            await _repository.CreateAsync(request);

        public async Task UpdateAsync(string key, UpdateApiKeyRequest request) =>
            await _repository.UpdateAsync(key, request);

        public async Task RevokeAsync(string key) =>
            await _repository.DeleteAsync(key);
    }
}
