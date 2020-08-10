using System.Linq;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Services
{
    public class UserService : IUserService
    {
        private readonly IAuth0ApiUserRepository _repository;

        public UserService(IAuth0ApiUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<UserResponse[]> SearchAsync(string query) =>
            (await _repository.SearchAsync(query))
                .Select(ToResponse)
                .ToArray();

        public async Task<UserResponse> GetByIdAsync(string id)
        {
            var user = (await _repository.SearchAsync($"user_metadata.ownership_id:\"{id}\""))
                .FirstOrDefault();

            return user == null
                ? null
                : ToResponse(user);
        }

        private UserResponse ToResponse(UserEntity entity) => new UserResponse
        {
            UserId = entity.UserId,
            Email = entity.Email,
            Username = entity.Username,
            Picture = entity.Picture,
            Name = entity.Name,
            UserMetadata = new UserMetadataResponse
            {
                OwnershipId = entity.UserMetadata.OwnershipId,
                Campaigns = entity.UserMetadata.Campaigns
            }
        };
    }
}
