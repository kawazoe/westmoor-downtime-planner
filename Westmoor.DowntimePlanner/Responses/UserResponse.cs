using System;

namespace Westmoor.DowntimePlanner.Responses
{
    public class UserResponse
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public bool IsEmailVerified { get; set; }
        public string Username { get; set; }
        public string PhoneNumber { get; set; }
        public string IsPhoneNumberVerified { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public UserIdentityResponse[] Identities { get; set; }
        public object AppMetadata { get; set; }
        public UserMetadataResponse UserMetadata { get; set; }
        public string Picture { get; set; }
        public string Name { get; set; }
        public string Nickname { get; set; }
        public string[] MultiFactors { get; set; }
        public string LastIpAddress { get; set; }
        public DateTimeOffset LastLogin { get; set; }
        public int LoginCount { get; set; }
        public bool IsBlocked { get; set; }
        public bool GivenName { get; set; }
        public bool FamilyName { get; set; }
    }
}
