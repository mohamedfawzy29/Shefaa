
namespace Shefaa.Models
{
    public class Organization
    {
        public Guid Id { get; set; }
        [StringLength(100)]
        public required string LegalName { get; set; }
        [StringLength(50)]
        public required string TaxNumber { get; set; }
        [StringLength(100)]
        public string? CommercialRegistrationNumber { get; set; }
        [StringLength(100)]
        [EmailAddress]
        public required string MainEmail { get; set; }
        [StringLength(15)]
        public required string MainPhone { get; set; }
        [StringLength(500)]
        public string? LogoImg { get; set; }
        [Url]
        public string? WebsiteUrl { get; set; }
        [StringLength(20)]
        public string Status { get; set; } = "Active";
        public ICollection<Branch> Branches { get; set; } = new List<Branch>();
    }
}
