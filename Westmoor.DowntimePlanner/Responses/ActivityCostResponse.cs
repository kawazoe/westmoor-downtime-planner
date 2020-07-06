namespace Westmoor.DowntimePlanner.Responses
{
    public class ActivityCostResponse
    {
        public string Kind { get; set; }
        public string JexlExpression { get; set; }
        public ActivityParameterResponse[] Parameters { get; set; }
    }
}
