namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateApiKeyRequest
    {
        public string Owner { get; set; }
        public string[] Permissions { get; set; }
        public string[] SharedWith { get; set; }
    }
}
