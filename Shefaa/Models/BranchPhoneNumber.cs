using System.ComponentModel.DataAnnotations;

namespace Shefaa.Models
{
    public class BranchPhoneNumber
    {
        public Guid Id { get; set; }

        [StringLength(15)]
        public required string PhoneNumber { get; set; }
        public Guid BranchId { get; set; }
        public Branch Branch { get; set; } = null!;
    }
}
