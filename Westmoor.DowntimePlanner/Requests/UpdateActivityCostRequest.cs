namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateActivityCostRequest
    {
        public string Kind { get; set; }
        public string JexlExpression { get; set; }
        public UpdateActivityParameterRequest[] Parameters { get; set; }
    }
}