namespace Shefaa.Models
{
    public class ApplicationUserOTP
    {
        public Guid Id { get; set; }
        public Guid ApplicationUserId { get; set; }
        public ApplicationUser applicationUser { get; set; }
        public string OTP { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool IsValid { get; set; }
        public DateTime Validto { get; set; }


        public ApplicationUserOTP()

        {

        }
        public ApplicationUserOTP(string OTP, Guid ApplicationUserId)

        {
            this.OTP = OTP;
            this.ApplicationUserId = ApplicationUserId;
            Id = Guid.NewGuid();
            CreatedAt = DateTime.Now;
            IsValid = true;
            Validto = DateTime.UtcNow.AddMinutes(30);

        }

    }
}
