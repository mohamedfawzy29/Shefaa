namespace Shefaa.DTOs.Request
{
    public class UpdateOrganizationRequest
    {
        public required string LegalName { get; set; }
        public required string TaxNumber { get; set; }
        public string? CommercialRegistrationNumber { get; set; }
        public required string MainEmail { get; set; }
        public required string MainPhone { get; set; }
        public string? LogoImg { get; set; }
        public string? WebsiteUrl { get; set; }
        public string Status { get; set; } = "Active";
    }
}
