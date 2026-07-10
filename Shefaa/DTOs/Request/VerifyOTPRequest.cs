namespace Shefaa.DTOs.Request
{
    public class VerifyOTPRequest
    {
        public Guid OTP { get; set; }
        public Guid UserId { get; set; }
    }
}
