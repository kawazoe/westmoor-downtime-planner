using System;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Security
{
    public class ApiKeyResponse
    {
        public string Key { get; set; }
        public string Owner { get; set; }
        public string[] Permissions { get; set; }
        public SharedWithResponse[] SharedWith { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
    }
}
