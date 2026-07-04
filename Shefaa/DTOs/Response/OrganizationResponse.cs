namespace Shefaa.DTOs.Response
{
    public class OrganizationResponse
    {
        public Guid Id { get; set; }
        public string LegalName { get; set; } = string.Empty;
        public string TaxNumber { get; set; } = string.Empty;
        public string? CommercialRegistrationNumber { get; set; }
        public string MainEmail { get; set; } = string.Empty;
        public string MainPhone { get; set; } = string.Empty;
        public string? LogoImg { get; set; }
        public string? WebsiteUrl { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
