namespace Shefaa.Models
{
    public enum ReceptionistStatus
    {
        Pending,
        Approved,
        Rejected,
        Suspended
    }
    public class Receptionist
    {
        public Guid ReceptionistId { get; set; }
        public Guid UserId { get; set; }
        public Guid BranchId { get; set; }
        public ApplicationUser User { get; set; }
        public Branch Branch { get; set; }
        [Required]
        public ReceptionistStatus Status { get; set; } = ReceptionistStatus.Pending;
    }
}
