namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateCharacterRequest
    {
        public string PlayerFullName { get; set; }
        public string CharacterFullName { get; set; }
        public int AccruedDowntimeDays { get; set; }
        public string[] SharedWith { get; set; }
    }
}
