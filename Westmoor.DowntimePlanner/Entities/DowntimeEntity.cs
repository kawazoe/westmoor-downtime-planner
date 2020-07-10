namespace Westmoor.DowntimePlanner.Entities
{
    public class DowntimeEntity : CosmosEntity
    {
        public CharacterEntity Character { get; set; }
        public ActivityEntity Activity { get; set; }
        public DowntimeCostEntity[] Costs { get; set; }
    }
}
