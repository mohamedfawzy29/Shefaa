namespace Shefaa.DTOs.Request
{
    public class ResetPasswordRequest
    {
        public string UserNameOrEmail { get; set; } = string.Empty;
        public string ResetToken { get; set; } = string.Empty;
        [DataType(DataType.Password)]
        public string NewPassword { get; set; } = string.Empty;
        [Compare(nameof(NewPassword), ErrorMessage = "Password and Confirm Password do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
