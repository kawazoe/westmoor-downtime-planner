using System.Linq;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Services
{
    public class DowntimeService : IDowntimeService
    {
        private readonly IDowntimeRepository _repository;

        public DowntimeService(IDowntimeRepository repository)
        {
            _repository = repository;
        }

        public async Task<DowntimeResponse[]> GetCurrentAsync() =>
            (await _repository.GetAsync(d => d.Costs.Any(c => c.Value < c.Goal)))
                .Select(ToResponse)
                .ToArray();

        public async Task<DowntimeResponse[]> GetCompletedAsync() =>
            (await _repository.GetAsync(d => d.Costs.Any(c => c.Value >= c.Goal)))
                .Select(ToResponse)
                .ToArray();

        public async Task<DowntimeResponse> GetByIdAsync(string id) =>
            ToResponse(await _repository.GetByIdAsync(id));

        public async Task CreateAsync(CreateDowntimeRequest request) =>
            await _repository.CreateAsync(request);

        public async Task UpdateAsync(string id, UpdateDowntimeRequest request) =>
            await _repository.UpdateAsync(id, request);

        public async Task AdvanceAsync(string id, AdvanceDowntimeRequest request) =>
            await _repository.AdvanceAsync(id, request);

        public async Task AdvanceBatchAsync(AdvanceDowntimeBatchRequest request) =>
            await _repository.AdvanceBatchAsync(request);

        public async Task DeleteAsync(string id) =>
            await _repository.DeleteAsync(id);

        private DowntimeResponse ToResponse(DowntimeEntity entity) =>
            new DowntimeResponse
            {
                Id = entity.Id,
                Character = new CharacterResponse
                {
                    Id = entity.Character.Id,
                    PlayerFullName = entity.Character.PlayerFullName,
                    CharacterFullName = entity.Character.CharacterFullName,
                    AccruedDowntimeDays = entity.Character.AccruedDowntimeDays
                },
                Activity = new ActivityResponse
                {
                    Id = entity.Activity.Id,
                    Name = entity.Activity.Name,
                    DescriptionMarkdown = entity.Activity.DescriptionMarkdown,
                    ComplicationMarkdown = entity.Activity.ComplicationMarkdown,
                    Costs = entity.Activity.Costs
                        .Select(c => new ActivityCostResponse
                        {
                            Kind = c.Kind,
                            JexlExpression = c.JexlExpression,
                            Parameters = c.Parameters
                                .Select(p => new ActivityParameterResponse
                                {
                                    VariableName = p.VariableName,
                                    Description = p.Description
                                })
                                .ToArray()
                        })
                        .ToArray()
                },
                Progresses = entity.Costs
                    .Select(p => new DowntimeProgressResponse
                    {
                        ActivityCostKind = p.ActivityCostKind,
                        Value = p.Value,
                        Goal = p.Goal
                    })
                    .ToArray(),
                SharedWith = entity.SharedWith
            };
    }
}
