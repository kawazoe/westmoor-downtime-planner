namespace Westmoor.DowntimePlanner.Requests
{
    public class AdvanceDowntimeBatchRequest
    {
        public string[] Ids { get; set; }
        public AdvanceDowntimeRequest Request { get; set; }
    }
}
