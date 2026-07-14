namespace Shefaa.DTOs.Request
{
    public class CreateBranchRequest
    {
        public required string BranchName { get; set; }
        public required string BranchEmail { get; set; }
        public string? Country { get; set; } = "Egypt";
        public required string City { get; set; }
        public required string Governorate { get; set; }
        public required string Address { get; set; }
        public bool IsActive { get; set; } = true;

        public Guid? OrganizationId { get; set; } = Guid.Empty;
    }
}
