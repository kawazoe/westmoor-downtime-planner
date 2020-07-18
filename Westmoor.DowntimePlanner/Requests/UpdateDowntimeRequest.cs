namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateDowntimeRequest
    {
        public UpdateDowntimeCostRequest[] Costs { get; set; }
        public string[] SharedWith { get; set; }
    }
}
