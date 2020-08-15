namespace Westmoor.DowntimePlanner
{
    public static class Policies
    {
        public const string ReadCampaigns = "read:campaigns";
        public const string ReadActivities = "read:activities";
        public const string ReadCharacters = "read:characters";
        public const string ReadDowntimes = "read:downtimes";
        public const string ReadUsers = "read:users";
        public const string WriteCampaigns = "write:campaigns";
        public const string WriteActivities = "write:activities";
        public const string WriteApiKeys = "write:apikeys";
        public const string WriteCharacters = "write:characters";
        public const string WriteDowntimes = "write:downtimes";

        public static readonly string[] All = {
            ReadCampaigns,
            ReadActivities,
            ReadCharacters,
            ReadDowntimes,
            ReadUsers,
            WriteCampaigns,
            WriteActivities,
            WriteApiKeys,
            WriteCharacters,
            WriteDowntimes
        };
    }
}
