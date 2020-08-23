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
    [Authorize(Policy = Policies.ReadCampaigns)]
    public class CampaignController : ControllerBase
    {
        private readonly ICampaignService _service;

        public CampaignController(ICampaignService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<CampaignEntity[]> GetAllAsync() =>
            await _service.GetAllAsync();

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<CampaignEntity> GetByIdAsync(string id) =>
            await _service.GetByIdAsync(id);

        [HttpPost]
        [Authorize(Policy = Policies.WriteCampaigns)]
        public async Task CreateAsync(CreateCampaignRequest request) =>
            await _service.CreateAsync(request);

        [HttpPut("{id}")]
        [Authorize(Policy = Policies.WriteCampaigns)]
        public async Task UpdateAsync(string id, UpdateCampaignRequest request) =>
            await _service.UpdateAsync(id, request);

        [HttpDelete("{idp}/{id}")]
        [Authorize(Policy = Policies.WriteCampaigns)]
        public async Task DeleteAsync(string idp, string id) =>
            await _service.DeleteAsync(idp, id);
    }
}
