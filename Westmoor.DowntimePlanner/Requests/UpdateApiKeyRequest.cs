namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateApiKeyRequest
    {
        public string Owner { get; set; }
        public string[] Permissions { get; set; }
        public UpdateSharedWithRequest[] SharedWith { get; set; }
    }
}
