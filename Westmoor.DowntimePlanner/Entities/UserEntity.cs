using System;
using System.Text.Json.Serialization;

namespace Westmoor.DowntimePlanner.Entities
{
    public class UserEntity
    {
        [JsonPropertyName("user_id")]
        public string UserId { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }

        [JsonPropertyName("email_verified")]
        public bool IsEmailVerified { get; set; }

        [JsonPropertyName("username")]
        public string Username { get; set; }

        [JsonPropertyName("phone_number")]
        public string PhoneNumber { get; set; }

        [JsonPropertyName("phone_verified")]
        public string IsPhoneNumberVerified { get; set; }

        [JsonPropertyName("created_at")]
        public DateTimeOffset CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTimeOffset UpdatedAt { get; set; }

        [JsonPropertyName("identities")]
        public UserIdentityEntity[] Identities { get; set; }

        [JsonPropertyName("app_metadata")]
        public object AppMetadata { get; set; }

        [JsonPropertyName("user_metadata")]
        public UserMetadataEntity UserMetadata { get; set; }

        [JsonPropertyName("picture")]
        public string Picture { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("nickname")]
        public string Nickname { get; set; }

        [JsonPropertyName("multifactor")]
        public string[] MultiFactors { get; set; }

        [JsonPropertyName("last_ip")]
        public string LastIpAddress { get; set; }

        [JsonPropertyName("last_login")]
        public DateTimeOffset LastLogin { get; set; }

        [JsonPropertyName("login_count")]
        public int LoginCount { get; set; }

        [JsonPropertyName("blocked")]
        public bool IsBlocked { get; set; }

        [JsonPropertyName("given_name")]
        public bool GivenName { get; set; }

        [JsonPropertyName("family_name")]
        public bool FamilyName { get; set; }
    }
}
