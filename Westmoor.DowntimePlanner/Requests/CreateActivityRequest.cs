namespace Westmoor.DowntimePlanner.Requests
{
    public class CreateActivityRequest
    {
        public string Name { get; set; }
        public string DescriptionMarkdown { get; set; }
        public string ComplicationMarkdown { get; set; }
        public CreateActivityCostRequest[] Costs { get; set; }
        public CreateSharedWithRequest[] SharedWith { get; set; }
    }
}
