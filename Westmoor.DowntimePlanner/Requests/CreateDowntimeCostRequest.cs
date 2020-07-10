namespace Westmoor.DowntimePlanner.Requests
{
    public class CreateDowntimeCostRequest
    {
        public string ActivityCostKind { get; set; }
        public int Goal { get; set; }
    }
}
