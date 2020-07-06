using System;

namespace Westmoor.DowntimePlanner.Entities
{
    public class ApiKeyEntity
    {
        public string Key { get; set; }
        public string Owner { get; set; }
        public string[] Roles { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
    }
}
