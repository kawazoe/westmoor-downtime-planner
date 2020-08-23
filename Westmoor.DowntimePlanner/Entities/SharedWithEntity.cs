using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace Westmoor.DowntimePlanner.Entities
{
    public class SharedWithEntity
    {
        [JsonConverter(typeof(StringEnumConverter), typeof(CamelCaseNamingStrategy))]
        public SharedWithKind Kind { get; set; }
        public string OwnershipId { get; set; }
        public string Picture { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
