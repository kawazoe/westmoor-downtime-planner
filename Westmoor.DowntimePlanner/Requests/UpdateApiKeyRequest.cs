namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateApiKeyRequest
    {
        public string Owner { get; set; }
        public string[] Roles { get; set; }
    }
}
