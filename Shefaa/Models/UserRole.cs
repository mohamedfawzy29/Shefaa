using Microsoft.EntityFrameworkCore;

namespace Shefaa.Models
{
    [PrimaryKey(nameof(UserId), nameof(RoleId))]
    public class UserRole
    {
        public Guid RoleId { get; set; }
        public Guid UserId { get; set; }

        public User user { get; set; }
        public Role role { get; set; }
    }
}
