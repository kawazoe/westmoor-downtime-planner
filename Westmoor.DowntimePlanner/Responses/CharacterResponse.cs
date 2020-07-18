namespace Westmoor.DowntimePlanner.Responses
{
    public class CharacterResponse
    {
        public string Id { get; set; }
        public string PlayerFullName { get; set; }
        public string CharacterFullName { get; set; }
        public int AccruedDowntimeDays { get; set; }
        public string[] SharedWith { get; set; }
    }
}
