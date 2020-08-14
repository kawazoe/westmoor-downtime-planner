namespace Westmoor.DowntimePlanner.Entities
{
    public class DowntimeEntity : CosmosEntityBase
    {
        public CharacterEntity Character { get; set; }
        public ActivityEntity Activity { get; set; }
        public DowntimeCostEntity[] Costs { get; set; }
    }
}
