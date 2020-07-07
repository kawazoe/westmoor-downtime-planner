using System;

namespace Westmoor.DowntimePlanner
{
    public interface IClock
    {
        DateTimeOffset UtcNow { get; }
    }
}
