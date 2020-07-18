namespace Westmoor.DowntimePlanner.Requests
{
    public class CreateDowntimeRequest
    {
        public string CharacterId { get; set; }
        public string ActivityId { get; set; }
        public CreateDowntimeCostRequest[] Costs { get; set; }
        public string[] SharedWith { get; set; }
    }
}
