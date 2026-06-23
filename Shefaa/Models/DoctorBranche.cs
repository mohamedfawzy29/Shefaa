using System.ComponentModel.DataAnnotations.Schema;

namespace Shefaa.Models
{
    public class DoctorBranche
    {
        public int Id { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal ConsultionFee { get; set; }
        public bool IsPrimary { get; set; } = true;
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;
        public int BranchId { get; set; }
        public Branch Branch { get; set; } = null!;
    }
}
