namespace Westmoor.DowntimePlanner.Requests
{
    public class CreateCampaignRequest
    {
        public string Name { get; set; }
        public string[] SharedWith { get; set; }
    }
}
