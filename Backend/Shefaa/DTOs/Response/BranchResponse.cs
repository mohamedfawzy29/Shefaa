namespace Shefaa.DTOs.Response
{
    public class BranchResponse
    {
        public Guid Id { get; set; }

        public string BranchName { get; set; } = string.Empty;
        public string BranchEmail { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Governorate { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        public bool IsActive { get; set; }

        public Guid OrganizationId { get; set; }

        public string OrganizationName { get; set; } = string.Empty;
    }

}