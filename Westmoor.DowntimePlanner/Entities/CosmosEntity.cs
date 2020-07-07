using System;

namespace Westmoor.DowntimePlanner.Entities
{
    public class CosmosEntity
    {
        public string Id { get; set; }
        public string Idp { get; set; }

        public virtual string TypeName => GetType().Name;
        public virtual int TypeVersion => 1;

        public DateTimeOffset CreatedOn { get; set; }
        public DateTimeOffset? ModifiedOn { get; set; }
    }
}
