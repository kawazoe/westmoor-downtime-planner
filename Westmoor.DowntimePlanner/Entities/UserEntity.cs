using System.Text.Json.Serialization;

namespace Westmoor.DowntimePlanner.Entities
{
    public class UserEntity
    {
        [JsonPropertyName("user_id")]
        public string UserId { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }

        [JsonPropertyName("picture")]
        public string Picture { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("user_metadata")]
        public UserMetadataEntity UserMetadata { get; set; }
    }
}