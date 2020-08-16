namespace Westmoor.DowntimePlanner.Responses
{
    public class UserIdentityResponse
    {
        public string Connection { get; set; }
        public string UserId { get; set; }
        public string Provider { get; set; }
        public bool IsSocial { get; set; }
    }
}