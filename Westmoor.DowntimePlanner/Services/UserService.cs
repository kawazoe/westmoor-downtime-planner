using System.Linq;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Extensions;
using Westmoor.DowntimePlanner.Repositories;
using Westmoor.DowntimePlanner.Requests;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Services
{
    public class UserService : IUserService
    {
        private readonly IAuth0ApiUserReadRepository _readRepository;
        private readonly IAuth0ApiUserWriteRepository _writeRepository;

        public UserService(
            IAuth0ApiUserReadRepository readRepository,
            IAuth0ApiUserWriteRepository writeRepository
        )
        {
            _readRepository = readRepository;
            _writeRepository = writeRepository;
        }

        public async Task<UserResponse[]> SearchAsync(string query) =>
            (await _readRepository.SearchAsync(query))
                .Select(ToResponse)
                .ToArray();

        public async Task<UserResponse> GetByIdAsync(string id) =>
            (await _readRepository.GetByIdAsync(id))
                .MapOrDefault(ToResponse);

        public async Task<string[]> GetCampaignsAsync(string id) =>
            await _readRepository.GetTenantsAsync(id);

        public async Task AddCampaignAsync(string id, AddCampaignRequest request) =>
            await _writeRepository.AddTenantAsync(id, request.CampaignId);

        public async Task RemoveCampaignAsync(string id, string campaignId) =>
            await _writeRepository.RemoveTenantAsync(id, campaignId);

        private static UserResponse ToResponse(UserEntity entity) => new UserResponse
        {
            UserId = entity.UserId,
            Email = entity.Email,
            IsEmailVerified = entity.IsEmailVerified,
            Username = entity.Username,
            PhoneNumber = entity.PhoneNumber,
            IsPhoneNumberVerified = entity.IsPhoneNumberVerified,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            Identities = entity.Identities
                ?.Select(i => new UserIdentityResponse
                {
                    Connection = i.Connection,
                    UserId = i.UserId,
                    Provider = i.Provider,
                    IsSocial = i.IsSocial
                })
                .ToArray(),
            AppMetadata = entity.AppMetadata,
            UserMetadata = entity.UserMetadata
                ?.Map(m => new UserMetadataResponse
                {
                    OwnershipId = m.OwnershipId,
                    Campaigns = m.Campaigns
                }),
            Picture = entity.Picture,
            Name = entity.Name,
            Nickname = entity.Nickname,
            MultiFactors = entity.MultiFactors,
            LastIpAddress = entity.LastIpAddress,
            LastLogin = entity.LastLogin,
            LoginCount = entity.LoginCount,
            IsBlocked = entity.IsBlocked,
            GivenName = entity.GivenName,
            FamilyName = entity.FamilyName
        };
    }
}
