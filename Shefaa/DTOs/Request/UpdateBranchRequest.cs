namespace Shefaa.DTOs.Request
{
    public class UpdateBranchRequest
    {
        public string? BranchName { get; set; }
        public string? BranchEmail { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public string? Governorate { get; set; }
        public string? Address { get; set; }

        public bool? IsActive { get; set; }

        public Guid? OrganizationId { get; set; }
    }
}