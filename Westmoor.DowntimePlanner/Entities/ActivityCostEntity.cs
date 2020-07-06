namespace Westmoor.DowntimePlanner.Entities
{
    public class ActivityCostEntity
    {
        public string Kind { get; set; }
        public string JexlExpression { get; set; }
        public ActivityParameterEntity[] Parameters { get; set; }
    }
}
