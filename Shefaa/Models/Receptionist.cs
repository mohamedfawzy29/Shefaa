namespace Shefaa.Models
{
    public class Receptionist
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid BranchId { get; set; }
        public ApplicationUser User { get; set; }
        public Branch Branch { get; set; }
    }
}
