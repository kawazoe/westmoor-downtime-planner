using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Services;

namespace Westmoor.DowntimePlanner.Controllers
{
    [ApiController]
    [Route("api/v1/batch/character")]
    [Authorize(Policy = Policies.ReadCharacters)]
    public class CharacterBatchController : ControllerBase
    {
        private readonly ICharacterService _service;

        public CharacterBatchController(ICharacterService service)
        {
            _service = service;
        }

        [HttpPut("award")]
        [Authorize(Policy = Policies.WriteCharacters)]
        public async Task AwardAsync(AwardCharacterBatchRequest request)
        {
            foreach (var id in request.Ids)
            {
                await _service.AwardAsync(id, request.Request);
            }
        }
    }
}
