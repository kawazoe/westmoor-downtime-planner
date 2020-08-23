namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateCampaignRequest
    {
        public string Name { get; set; }
        public UpdateSharedWithRequest[] SharedWith { get; set; }
    }
}
