using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Responses;
using Westmoor.DowntimePlanner.Services;

namespace Westmoor.DowntimePlanner.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize(Policy = Policies.ReadCharacters)]
    public class CharacterController : ControllerBase
    {
        private readonly ICharacterService _service;

        public CharacterController(ICharacterService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<CharacterResponse[]> GetAllAsync() =>
            await _service.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<CharacterResponse> GetByIdAsync(string id) =>
            await _service.GetByIdAsync(id);

        [HttpPost]
        [Authorize(Policy = Policies.WriteCharacters)]
        public async Task CreateAsync(CreateCharacterRequest request) =>
            await _service.CreateAsync(request);

        [HttpPut("{id}")]
        [Authorize(Policy = Policies.WriteCharacters)]
        public async Task UpdateAsync(string id, UpdateCharacterRequest request) =>
            await _service.UpdateAsync(id, request);

        [HttpPut("{id}/award")]
        [Authorize(Policy = Policies.WriteCharacters)]
        public async Task AwardAsync(string id, AwardDowntimeRequest request) =>
            await _service.AwardAsync(id, request);

        [HttpDelete("{id}")]
        [Authorize(Policy = Policies.WriteCharacters)]
        public async Task DeleteAsync(string id) =>
            await _service.DeleteAsync(id);
    }
}
