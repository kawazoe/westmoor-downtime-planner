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
    [Authorize(Policy = Policies.ReadActivities)]
    public class ActivityController : ControllerBase
    {
        private readonly IActivityService _service;

        public ActivityController(IActivityService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActivityEntity[]> GetAllAsync() =>
            await _service.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<ActivityEntity> GetByIdAsync(string id) =>
            await _service.GetByIdAsync(id);

        [HttpPost]
        [Authorize(Policy = Policies.WriteActivities)]
        public async Task CreateAsync(CreateActivityRequest request) =>
            await _service.CreateAsync(request);

        [HttpPut("{id}")]
        [Authorize(Policy = Policies.WriteActivities)]
        public async Task UpdateAsync(string id, UpdateActivityRequest request) =>
            await _service.UpdateAsync(id, request);

        [HttpDelete("{id}")]
        [Authorize(Policy = Policies.WriteActivities)]
        public async Task DeleteAsync(string id) =>
            await _service.DeleteAsync(id);
    }
}
