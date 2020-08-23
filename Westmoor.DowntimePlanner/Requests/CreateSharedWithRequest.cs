using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Requests
{
    public class CreateSharedWithRequest
    {
        public SharedWithKind Kind { get; set; }
        public string OwnershipId { get; set; }
    }
}
