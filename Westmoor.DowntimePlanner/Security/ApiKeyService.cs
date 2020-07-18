using System.Linq;
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

        public async Task<ApiKeyResponse[]> GetAllAsync() =>
            (await _repository.GetAllAsync())
                .Select(ToResponse)
                .ToArray();

        public async Task<ApiKeyResponse> GetByKeyAsync(string key) =>
            ToResponse(await _repository.GetByKeyAsync(key));

        public async Task CreateAsync(CreateApiKeyRequest request) =>
            await _repository.CreateAsync(request);

        public async Task UpdateAsync(string key, UpdateApiKeyRequest request) =>
            await _repository.UpdateAsync(key, request);

        public async Task RevokeAsync(string key) =>
            await _repository.DeleteAsync(key);

        private ApiKeyResponse ToResponse(ApiKeyEntity entity) =>
            entity == null
                ? null
                : new ApiKeyResponse
                {
                    Key = entity.Id,
                    Owner = entity.Owner,
                    Roles = entity.Roles,
                    SharedWith = entity.SharedWith,
                    CreatedOn = entity.CreatedOn
                };
    }
}
