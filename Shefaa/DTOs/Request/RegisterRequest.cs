namespace Shefaa.DTOs.Request
{

    public class RegisterRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
        public Gender Gender { get; set; } = Gender.Male;
        public string ProfileImg { get; set; } = "default.png";
        public DateOnly DateOfBirth { get; set; }
        public string Role { get; set; } = CD.PATIENT_ROLE;
    }
}
