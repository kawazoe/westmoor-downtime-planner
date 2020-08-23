namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateDowntimeRequest
    {
        public UpdateDowntimeCostRequest[] Costs { get; set; }
        public UpdateSharedWithRequest[] SharedWith { get; set; }
    }
}
