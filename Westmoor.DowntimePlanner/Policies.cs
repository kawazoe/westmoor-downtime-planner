namespace Westmoor.DowntimePlanner
{
    public static class Policies
    {
        public const string OnlyAdmins = nameof(OnlyAdmins);

        public static readonly (string name, string role)[] All =
        {
            (OnlyAdmins, Roles.Admin)
        };
    }
}
