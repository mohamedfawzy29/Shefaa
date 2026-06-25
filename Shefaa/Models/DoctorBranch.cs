
namespace Shefaa.Models
{
    [PrimaryKey(nameof(DoctorId), nameof(BranchId))]
    public class DoctorBranch
    {
        [Column(TypeName = "decimal(18, 2)")]
        public decimal ConsultionFee { get; set; }
        public bool IsPrimary { get; set; } = true;
        public Guid DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;
        public Guid BranchId { get; set; }
        public Branch Branch { get; set; } = null!;
    }
}
