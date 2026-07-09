namespace Shefaa.DTOs.Request
{

    public class RegisterDoctorRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        [Compare(nameof(Password), ErrorMessage = "Password and Confirm Password do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
        public Gender Gender { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public IFormFile? ProfileImg { get; set; }
        [Required]
        [MaxLength(1000)]
        public string Bio { get; set; } = string.Empty;
        [Range(0, 60)]
        public int YearsOfExperience { get; set; }
        [Required]
        [MaxLength(50)]
        public string LicenseNumber { get; set; } = string.Empty;
        [Required]
        public Guid SpecializationId { get; set; }
    }
}
