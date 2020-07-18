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
    [Authorize(Policy = Policies.ReadDowntimes)]
    public class DowntimeController : ControllerBase
    {
        private readonly IDowntimeService _service;

        public DowntimeController(IDowntimeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<DowntimeResponse[]> GetAllAsync() =>
            await _service.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<DowntimeResponse> GetByIdAsync(string id) =>
            await _service.GetByIdAsync(id);

        [HttpPost]
        [Authorize(Policy = Policies.WriteDowntimes)]
        public async Task CreateAsync(CreateDowntimeRequest request) =>
            await _service.CreateAsync(request);

        [HttpPut("{id}")]
        [Authorize(Policy = Policies.WriteDowntimes)]
        public async Task UpdateAsync(string id, UpdateDowntimeRequest request) =>
            await _service.UpdateAsync(id, request);

        [HttpDelete("{id}")]
        [Authorize(Policy = Policies.WriteDowntimes)]
        public async Task DeleteAsync(string id) =>
            await _service.DeleteAsync(id);
    }
}
