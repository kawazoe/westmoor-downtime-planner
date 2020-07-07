using System;

namespace Westmoor.DowntimePlanner.Entities
{
    public class CosmosEntity
    {
        public string Id { get; set; }
        public virtual string Idp { get; set; }

        public virtual string Kind { get; set; }

        public DateTimeOffset CreatedOn { get; set; }
        public DateTimeOffset? ModifiedOn { get; set; }
    }
}
