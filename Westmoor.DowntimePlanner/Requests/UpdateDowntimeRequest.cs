namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateDowntimeRequest
    {
        public string CharacterId { get; set; }
        public string ActivityId { get; set; }
        public UpdateDowntimeProgressResponse[] Progresses { get; set; }
    }
}
