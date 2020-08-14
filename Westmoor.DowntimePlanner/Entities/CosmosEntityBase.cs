using System;

namespace Westmoor.DowntimePlanner.Entities
{
    public abstract class CosmosEntityBase
    {
        public string Id { get; set; }
        public string Idp { get; set; }

        public virtual string TypeName => GetType().Name;
        public virtual int TypeVersion => 1;

        public SharedWithEntity[] SharedWith { get; set; } = new SharedWithEntity[0];

        public DateTimeOffset CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTimeOffset? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
