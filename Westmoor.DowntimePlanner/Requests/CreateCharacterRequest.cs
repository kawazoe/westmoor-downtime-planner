namespace Westmoor.DowntimePlanner.Requests
{
    public class CreateCharacterRequest
    {
        public string PlayerFullName { get; set; }
        public string CharacterFullName { get; set; }
        public CreateSharedWithRequest[] SharedWith { get; set; }
    }
}
