namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateDowntimeCostRequest
    {
        public string ActivityCostKind { get; set; }
        public int Value { get; set; }
        public int Goal { get; set; }
    }
}
