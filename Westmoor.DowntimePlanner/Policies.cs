namespace Westmoor.DowntimePlanner
{
    public static class Policies
    {
        public const string ReadActivities = "read:activities";
        public const string ReadCharacters = "read:characters";
        public const string ReadDowntimes = "read:downtimes";
        public const string WriteActivities = "write:activities";
        public const string WriteApiKeys = "write:apikeys";
        public const string WriteCharacters = "write:characters";
        public const string WriteDowntimes = "write:downtimes";

        public static readonly string[] All = {
            ReadActivities,
            ReadCharacters,
            ReadDowntimes,
            WriteActivities,
            WriteApiKeys,
            WriteCharacters,
            WriteDowntimes
        };
    }
}
