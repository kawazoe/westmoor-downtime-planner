namespace Westmoor.DowntimePlanner.Requests
{
    public class CreateActivityCostRequest
    {
        public string Kind { get; set; }
        public string JexlExpression { get; set; }
        public CreateActivityParameterRequest[] Parameters { get; set; }
    }
}