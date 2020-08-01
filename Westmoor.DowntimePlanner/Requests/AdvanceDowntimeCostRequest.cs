namespace Westmoor.DowntimePlanner.Requests
{
    public class AdvanceDowntimeCostRequest
    {
        public string ActivityCostKind { get; set; }
        public int Delta { get; set; }
    }
}
