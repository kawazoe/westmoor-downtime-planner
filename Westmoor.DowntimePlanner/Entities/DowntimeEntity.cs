namespace Westmoor.DowntimePlanner.Entities
{
    public class DowntimeEntity : CosmosEntity
    {
        public CharacterEntity Character { get; set; }
        public ActivityEntity Activity { get; set; }
        public DowntimeProgressEntity[] Progresses { get; set; }
    }
}
