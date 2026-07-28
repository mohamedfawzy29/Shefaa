namespace Shefaa.DTOs.Response
{
    public class LookupResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Guid? OrganizationId { get; set; }
    }
}
