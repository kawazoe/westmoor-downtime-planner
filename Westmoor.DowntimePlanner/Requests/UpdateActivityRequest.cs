namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateActivityRequest
    {
        public string Name { get; set; }
        public string DescriptionMarkdown { get; set; }
        public string ComplicationMarkdown { get; set; }
        public UpdateActivityCostRequest[] Costs { get; set; }
    }

    public class UpdateActivityCostRequest
    {
        public string Kind { get; set; }
        public string JexlExpression { get; set; }
        public UpdateActivityParameterRequest[] Parameters { get; set; }
    }

    public class UpdateActivityParameterRequest
    {
        public string VariableName { get; set; }
        public string Description { get; set; }
    }
}
