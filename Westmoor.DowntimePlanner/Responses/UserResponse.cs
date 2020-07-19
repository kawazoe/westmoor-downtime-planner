namespace Westmoor.DowntimePlanner.Responses
{
    public class UserResponse
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Picture { get; set; }
        public string Name { get; set; }
        public UserMetadataResponse UserMetadata { get; set; }
    }
}
