using System.Text.Json.Serialization;

namespace Westmoor.DowntimePlanner.Entities
{
    public class UserIdentityEntity
    {
        [JsonPropertyName("connection")]
        public string Connection { get; set; }
        
        [JsonPropertyName("user_id")]
        public string UserId { get; set; }
        
        [JsonPropertyName("provider")]
        public string Provider { get; set; }
        
        [JsonPropertyName("isSocial")]
        public bool IsSocial { get; set; }
    }
}