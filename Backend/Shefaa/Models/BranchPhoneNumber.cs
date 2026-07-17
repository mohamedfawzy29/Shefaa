
namespace Shefaa.Models
{
    [PrimaryKey(nameof(PhoneNumber), nameof(BranchId))]
    public class BranchPhoneNumber
    {

        [StringLength(15)]
        public required string PhoneNumber { get; set; }
        public Guid BranchId { get; set; }
        public Branch Branch { get; set; }
    }
}
