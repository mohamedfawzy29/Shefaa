using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Shefaa.DTOs.Request
{
    public class AssignRolesRequest
    {
        [Required(ErrorMessage = "User Id Required")]
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "At least one role must be specified")]
        public List<string> Roles { get; set; } = new List<string>();
    }
}