using System.ComponentModel.DataAnnotations;

namespace Shefaa.Models
{
    public class Branch
    {
        public Guid Id { get; set; }
        [StringLength(150)]
        public required string BranchName { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public required string BranchEmail { get; set; }

        [StringLength(50)]
        public required string Country { get; set; }

        [StringLength(50)]
        public required string City { get; set; }

        [StringLength(50)]
        public required string Governorate { get; set; }

        [StringLength(250)]
        public required string Address { get; set; }

        public bool IsActive { get; set; } = true;

        public Guid OrganizationId { get; set; }
        public Organization Organization { get; set; } = null!;


        public ICollection<BranchPhoneNumber> BranchPhoneNumbers { get; set; } = new List<BranchPhoneNumber>();
        public ICollection<DoctorBranche> DoctorBranches { get; set; } = new List<DoctorBranche>();
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    }
}
