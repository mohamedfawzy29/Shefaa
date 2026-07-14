
namespace Shefaa.Models
{
    [PrimaryKey(nameof(UserId), nameof(PhoneNumber))]
    public class UserPhoneNumber
    {

        [ForeignKey(nameof(UserId))]
        public Guid UserId { get; set; }
        [Key, MaxLength(20)]
        public string PhoneNumber { get; set; }
        public ApplicationUser User { get; set; }
    }
}
