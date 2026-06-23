using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shefaa.Models
{
    [PrimaryKey(nameof(UserId), nameof(PhoneNumber))]
    public class UserPhoneNumber
    {

        [ForeignKey(nameof(UserId))]
        public Guid UserId { get; set; }
        [Key, MaxLength(20)]
        public string PhoneNumber { get; set; }
        public User User { get; set; }
    }
}
