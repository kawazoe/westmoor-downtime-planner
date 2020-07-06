using System;
using System.Collections.Generic;

namespace Westmoor.DowntimePlanner.Security
{
    public class ApiKeyResponse
    {
        public ApiKeyResponse(string key, string owner, IReadOnlyCollection<string> roles, DateTimeOffset createdOn)
        {
            Key = key ?? throw new ArgumentNullException(nameof(key));
            Owner = owner ?? throw new ArgumentNullException(nameof(owner));
            Roles = roles ?? throw new ArgumentNullException(nameof(roles));
            CreatedOn = createdOn;
        }

        public string Key { get; }
        public string Owner { get; }
        public IReadOnlyCollection<string> Roles { get; }
        public DateTimeOffset CreatedOn { get; }
    }
}
