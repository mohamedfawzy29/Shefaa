namespace Shefaa.DTOs.Request
{
    public class RegisterReceptionistRequest
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string UserName { get; set; } = string.Empty;
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
        [Required]
        [Compare(nameof(Password), ErrorMessage = "Password and Confirm Password do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
        [Required]
        public Gender Gender { get; set; }
        [Required]
        public DateOnly DateOfBirth { get; set; }
        public IFormFile? ProfileImg { get; set; }
        [MaxLength(255)]
        public string? Address { get; set; }
        [MaxLength(20)]
        public string? NationalId { get; set; }
        [Required]
        public Guid BranchId { get; set; }
    }
}