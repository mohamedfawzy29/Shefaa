

namespace Shefaa.Models
{
    public enum Gender
    {
        Male, Female
    }
    public class ApplicationUser : IdentityUser<Guid>
    {
        [MaxLength(50)]
        public string FirstName { get; set; }
        [MaxLength(50)]
        public string LastName { get; set; }
        public bool IsActive { get; set; }
        public Gender Gender { get; set; } = Gender.Male;
        public string ProfileImg { get; set; } = "default.png";
        public DateOnly DateOfBirth { get; set; }
        public Doctor? Doctor { get; set; }
        public Patient? Patient { get; set; }
        public Receptionist? Receptionist { get; set; }
        public ICollection<UserPhoneNumber> PhoneNumbers { get; set; } = new List<UserPhoneNumber>();
        public ICollection<ApplicationUserOTP> ApplicationUserOTPs { get; set; } = new List<ApplicationUserOTP>();
    }
}
