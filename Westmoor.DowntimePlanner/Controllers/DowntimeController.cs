using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;
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

        [HttpGet("current")]
        public async Task<DowntimeEntity[]> GetCurrentAsync() =>
            await _service.GetCurrentAsync();

        [HttpGet("completed")]
        public async Task<DowntimeEntity[]> GetCompletedAsync() =>
            await _service.GetCompletedAsync();

        [HttpGet("{id}")]
        public async Task<DowntimeEntity> GetByIdAsync(string id) =>
            await _service.GetByIdAsync(id);

        [HttpPost]
        [Authorize(Policy = Policies.WriteDowntimes)]
        public async Task CreateAsync(CreateDowntimeRequest request) =>
            await _service.CreateAsync(request);

        [HttpPut("{id}")]
        [Authorize(Policy = Policies.WriteDowntimes)]
        public async Task UpdateAsync(string id, UpdateDowntimeRequest request) =>
            await _service.UpdateAsync(id, request);

        [HttpPut("{id}/advance")]
        [Authorize(Policy = Policies.WriteDowntimes)]
        public async Task AdvanceAsync(string id, AdvanceDowntimeRequest request) =>
            await _service.AdvanceAsync(id, request);

        [HttpDelete("{idp}/{id}")]
        [Authorize(Policy = Policies.WriteDowntimes)]
        public async Task DeleteAsync(string idp, string id) =>
            await _service.DeleteAsync(idp, id);
    }
}
