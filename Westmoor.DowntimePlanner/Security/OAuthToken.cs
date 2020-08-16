using System.Text.Json.Serialization;

namespace Westmoor.DowntimePlanner.Security
{
    public class OAuthToken
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }

        [JsonPropertyName("token_type")]
        public string TokenType { get; set; }
    }
}
