namespace Westmoor.DowntimePlanner.Requests
{
    public class CreateCampaignRequest
    {
        public string Name { get; set; }
        public CreateSharedWithRequest[] SharedWith { get; set; }
    }
}
