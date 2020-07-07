namespace Westmoor.DowntimePlanner.Entities
{
    public class ActivityEntity : CosmosEntity
    {
        public string Name { get; set; }
        public string DescriptionMarkdown { get; set; }
        public string ComplicationMarkdown { get; set; }
        public ActivityCostEntity[] Costs { get; set; }
    }
}
