namespace Westmoor.DowntimePlanner.Entities
{
    public class ApiKeyEntity : CosmosEntity
    {
        public string Owner { get; set; }
        public string[] Permissions { get; set; }
    }
}
