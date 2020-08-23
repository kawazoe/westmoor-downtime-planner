namespace Westmoor.DowntimePlanner.Security
{
    public interface ITenantAccessor
    {
        string[] AccessibleTenants { get; }
        string[] ActiveTenants { get; }
    }
}
