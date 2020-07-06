namespace Westmoor.DowntimePlanner.Responses
{
    public class ActivityResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string DescriptionMarkdown { get; set; }
        public string ComplicationMarkdown { get; set; }
        public ActivityCostResponse[] Costs { get; set; }
    }
}
