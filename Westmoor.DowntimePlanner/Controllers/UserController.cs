using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Security;

namespace Westmoor.DowntimePlanner.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize(Policy = Policies.OnlyAdmins)]
    public class UserController
    {
        private readonly IApiKeyService _service;

        public UserController(IApiKeyService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ApiKeyResponse[]> GetAllAsync() =>
            await _service.GetAllAsync();

        [HttpGet("{key}")]
        [AllowAnonymous]
        public async Task<ApiKeyResponse> GetByKeyAsync(string key) =>
            await _service.GetByKeyAsync(key);

        [HttpPost]
        public async Task CreateAsync(CreateApiKeyRequest request) =>
            await _service.CreateAsync(request);

        [HttpPut("{key}")]
        public async Task UpdateAsync(string key, UpdateApiKeyRequest request) =>
            await _service.UpdateAsync(key, request);

        [HttpDelete("{key}")]
        public async Task RevokeAsync(string key) =>
            await _service.RevokeAsync(key);
    }
}
