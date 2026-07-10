namespace Shefaa.DTOs.Request
{
    public class RegisterPatientRequest
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
        [MaxLength(255)]
        public string? Address { get; set; }
        [MaxLength(50)]
        public string? NationalId { get; set; }
        [MaxLength(20)]
        public string? EmergencyContact { get; set; }
        [MaxLength(5)]
        public string? BloodType { get; set; }
    }
}
