namespace Westmoor.DowntimePlanner.Requests
{
    public class AwardCharacterBatchRequest
    {
        public string[] Ids { get; set; }
        public AwardCharacterRequest Request { get; set; }
    }
}
