public class ApplicationUserOTP
{
    public Guid Id { get; set; }
    public Guid ApplicationUserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; } = null!;
    public string OTP { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public bool IsValid { get; set; }
    public DateTime ValidTo { get; set; }

    public ApplicationUserOTP()
    {
    }

    public ApplicationUserOTP(string otp, Guid applicationUserId)
    {
        Id = Guid.NewGuid();
        OTP = otp;
        ApplicationUserId = applicationUserId;
        CreatedAt = DateTime.UtcNow;
        ValidTo = DateTime.UtcNow.AddMinutes(30);
        IsValid = true;
    }
}