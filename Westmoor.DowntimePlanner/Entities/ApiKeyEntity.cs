namespace Westmoor.DowntimePlanner.Entities
{
    public class ApiKeyEntity : CosmosEntity
    {
        public override string Idp { get; set; }
        public override string Kind { get; set; } = nameof(ApiKeyEntity);

        public string Owner { get; set; }
        public string[] Roles { get; set; }
    }
}
