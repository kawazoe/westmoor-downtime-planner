namespace Westmoor.DowntimePlanner.Responses
{
    public class DowntimeResponse
    {
        public string Id { get; set; }
        public CharacterResponse Character { get; set; }
        public ActivityResponse Activity { get; set; }
        public DowntimeProgressResponse[] Progresses { get; set; }
        public string[] SharedWith { get; set; }
    }
}
