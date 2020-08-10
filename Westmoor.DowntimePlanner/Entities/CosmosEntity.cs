using System;

namespace Westmoor.DowntimePlanner.Entities
{
    public class CosmosEntity
    {
        public string Id { get; set; }
        public string Idp { get; set; }

        public virtual string TypeName => GetType().Name;
        public virtual int TypeVersion => 1;

        public SharedWithEntity[] SharedWith = new SharedWithEntity[0];

        public DateTimeOffset CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTimeOffset? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
