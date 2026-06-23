namespace Shefaa.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int Age { get; set; }

        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string? Gender { get; set; }
        public string? ProfileImg { get; set; } = "default.png";
        public DateOnly DateOfBirth { get; set; }
        public ICollection<UserPhoneNumber> phoneNumbers { get; set; } = new List<UserPhoneNumber>();
        public Guid? BranchId { get; set; }
        public Branch? Branch { get; set; }
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<UserRole> Roles { get; set; } = new List<UserRole>();

    }
}
