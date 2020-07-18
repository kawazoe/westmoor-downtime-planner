using System;

namespace Westmoor.DowntimePlanner
{
    public class GuidUuidFactory : IUuidFactory
    {
        public string Create() => Guid.NewGuid().ToString();
    }
}