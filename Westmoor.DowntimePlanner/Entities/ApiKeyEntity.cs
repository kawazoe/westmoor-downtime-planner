namespace Westmoor.DowntimePlanner.Entities
{
    public class ApiKeyEntity : CosmosEntityBase
    {
        public string Owner { get; set; }
        public string[] Permissions { get; set; }
    }
}
