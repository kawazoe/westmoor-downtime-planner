using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Responses;
using Westmoor.DowntimePlanner.Services;

namespace Westmoor.DowntimePlanner.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [AllowAnonymous]
    public class DowntimeController
    {
        private readonly IDowntimeService _service;

        public DowntimeController(IDowntimeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<DowntimeResponse[]> GetAllAsync() =>
            await _service.GetAllAsync();

        [HttpPost]
        [Authorize(Policy = Policies.OnlyAdmins)]
        public async Task CreateAsync(CreateDowntimeRequest request) =>
            await _service.CreateAsync(request);

        [HttpPut("{id}")]
        [Authorize(Policy = Policies.OnlyAdmins)]
        public async Task UpdateAsync(string id, UpdateDowntimeRequest request) =>
            await _service.UpdateAsync(id, request);

        [HttpDelete("{id}")]
        [Authorize(Policy = Policies.OnlyAdmins)]
        public async Task DeleteAsync(string id) =>
            await _service.DeleteAsync(id);
    }
}
