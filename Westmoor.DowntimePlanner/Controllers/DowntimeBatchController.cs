using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Services;

namespace Westmoor.DowntimePlanner.Controllers
{
    [ApiController]
    [Route("api/v1/batch/[controller]")]
    [Authorize(Policy = Policies.ReadDowntimes)]
    public class DowntimeBatchController : ControllerBase
    {
        private readonly IDowntimeService _service;

        public DowntimeBatchController(IDowntimeService service)
        {
            _service = service;
        }

        [HttpPut("award")]
        [Authorize(Policy = Policies.WriteCharacters)]
        public async Task AwardAsync(CreateDowntimeBatchRequest request)
        {
            foreach (var req in request.Requests)
            {
                await _service.CreateAsync(req);
            }
        }

        [HttpPut("advance")]
        [Authorize(Policy = Policies.WriteDowntimes)]
        public async Task AdvanceAsync(AdvanceDowntimeBatchRequest request) =>
            await _service.AdvanceBatchAsync(request);
    }
}
