using System.Text.Json.Serialization;

namespace Westmoor.DowntimePlanner.Entities
{
    public class OauthTokenEntity
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }

        [JsonPropertyName("token_type")]
        public string TokenType { get; set; }
    }
}