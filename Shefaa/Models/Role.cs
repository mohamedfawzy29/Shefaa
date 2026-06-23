namespace Shefaa.Models
{
    public class Role
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }

        public List<User> users { get; set; }
    }
}
