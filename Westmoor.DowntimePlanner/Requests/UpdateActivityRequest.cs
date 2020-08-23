namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateActivityRequest
    {
        public string Name { get; set; }
        public string DescriptionMarkdown { get; set; }
        public string ComplicationMarkdown { get; set; }
        public UpdateActivityCostRequest[] Costs { get; set; }
        public UpdateSharedWithRequest[] SharedWith { get; set; }
    }
}
