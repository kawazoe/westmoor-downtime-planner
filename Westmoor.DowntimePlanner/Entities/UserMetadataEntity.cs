using System.Text.Json.Serialization;

namespace Westmoor.DowntimePlanner.Entities
{
    public class UserMetadataEntity
    {
        [JsonPropertyName("ownership_id")]
        public string OwnershipId { get; set; }

        [JsonPropertyName("campaigns")]
        public string[] Campaigns { get; set; }
    }
}