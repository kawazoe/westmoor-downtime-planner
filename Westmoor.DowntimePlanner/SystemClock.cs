using System;

namespace Westmoor.DowntimePlanner
{
    public class SystemClock : IClock
    {
        public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
    }
}