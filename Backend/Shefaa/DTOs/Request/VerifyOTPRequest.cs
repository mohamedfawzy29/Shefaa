namespace Shefaa.DTOs.Request
{
    public class VerifyOTPRequest
    {
        public string UserNameOrEmail { get; set; } = string.Empty;
        public string OTP { get; set; } = string.Empty;
    }
}