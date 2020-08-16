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
    [Authorize(Policy = Policies.ReadUsers)]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        [HttpGet("{query}")]
        public async Task<UserResponse[]> SearchAsync(string query) =>
            await _service.SearchAsync(query);

        [HttpGet("{id}/campaign")]
        public async Task<string[]> GetCampaignsAsync(string id) =>
            await _service.GetCampaignsAsync(id);

        [HttpPost("{id}/campaign")]
        public async Task AddCampaignAsync(string id, AddCampaignRequest request) =>
            await _service.AddCampaignAsync(id, request);

        [HttpDelete("{id}/campaign/{campaignId}")]
        public async Task RemoveCampaignAsync(string id, string campaignId) =>
            await _service.RemoveCampaignAsync(id, campaignId);
    }
}
