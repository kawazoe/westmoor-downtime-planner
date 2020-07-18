using System;
using System.Collections.Generic;

namespace Westmoor.DowntimePlanner.Security
{
    public class ApiKeyResponse
    {
        public string Key { get; set; }
        public string Owner { get; set; }
        public string[] Roles { get; set; }
        public string[] SharedWith { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
    }
}
