namespace Westmoor.DowntimePlanner.Entities
{
    public class CharacterEntity : CosmosEntityBase
    {
        public string PlayerFullName { get; set; }
        public string CharacterFullName { get; set; }
        public int AccruedDowntimeDays { get; set; }
    }
}
