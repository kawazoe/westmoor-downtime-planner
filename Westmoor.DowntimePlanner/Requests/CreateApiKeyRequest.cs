namespace Westmoor.DowntimePlanner.Requests
{
    public class CreateApiKeyRequest
    {
        public string Owner { get; set; }
        public string[] Roles { get; set; }
        public string[] SharedWith { get; set; }
    }
}
