using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Requests
{
    public class UpdateSharedWithRequest
    {
        public SharedWithKind Kind { get; set; }
        public string OwnershipId { get; set; }
    }
}
