using System;
using System.ComponentModel.DataAnnotations;

namespace Shefaa.DTOs.Request
{
    public class AddDoctorBranchRequest
    {
        [Required(ErrorMessage = "Branch ID required")]
        public Guid BranchId { get; set; }

        [Required(ErrorMessage = "Detection value required")]
        [Range(0, 100000, ErrorMessage = "Please enter a logical detection value")]
        public decimal ConsultionFee { get; set; }

        public bool IsPrimary { get; set; } = true;
    }
}