using System.ComponentModel.DataAnnotations;

namespace Shefaa.Models
{
    public class BranchPhoneNumber
    {
        public int Id { get; set; }

        [StringLength(15)]
        public required string PhoneNumber { get; set; }
        public int BranchId { get; set; }
        public Branch Branch { get; set; } = null!;
    }
}
