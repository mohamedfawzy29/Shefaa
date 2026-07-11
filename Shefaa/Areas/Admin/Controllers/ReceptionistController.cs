
namespace Shefaa.Areas.Admin.Controllers
{
    [Area(CD.ADMIN_AREA)]
    [Route("api/[controller]")]
    [Authorize(Roles = CD.ADMIN_ROLE)]
    [ApiController]
    public class ReceptionistController : ControllerBase
    {
        IRepository<Receptionist> _receptionistRepository;

        public ReceptionistController(IRepository<Receptionist> receptionistRepository)
        {
            _receptionistRepository = receptionistRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReceptionists()
        {
            var recepcionest = await _receptionistRepository.GetAsync(includes: [r => r.User, r => r.Branch, r => r.User.PhoneNumbers]);
            var response = recepcionest.Select(r => new ReceptionistResponse
            {
                ReceptionistId = r.ReceptionistId,
                UserId = r.UserId,
                FirstName = r.User.FirstName,
                LastName = r.User.LastName,
                Email = r.User.Email!,
                PhoneNumbers = r.User.PhoneNumbers.Select(p => p.PhoneNumber).ToList(),
                BranchName = r.Branch.BranchName,
                ProfileImageUrl = $"{Request.Scheme}://{Request.Host}/images/profiles/{r.User.ProfileImg}",
                Status = r.Status
            });

            return Ok(new ApiResponse<IEnumerable<ReceptionistResponse>>
            {
                IsSuccess = true,
                Message = "Receptionists retrieved successfully.",
                Data = response
            });
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetReceptionistById(Guid id)
        {
            var receptionist = await _receptionistRepository.GetOneAsynch(r => r.ReceptionistId == id, includes: [r => r.User, r => r.Branch, r => r.User.PhoneNumbers]);
            if (receptionist == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Receptionist not found."
                });
            }
            var response = new ReceptionistResponse
            {
                ReceptionistId = receptionist.ReceptionistId,
                UserId = receptionist.UserId,
                FirstName = receptionist.User.FirstName,
                LastName = receptionist.User.LastName,
                Email = receptionist.User.Email!,
                PhoneNumbers = receptionist.User.PhoneNumbers.Select(p => p.PhoneNumber).ToList(),
                BranchName = receptionist.Branch.BranchName,
                ProfileImageUrl = $"{Request.Scheme}://{Request.Host}/images/profiles/{receptionist.User.ProfileImg}",
                Status = receptionist.Status
            };

            return Ok(new ApiResponse<ReceptionistResponse>
            {
                IsSuccess = true,
                Message = "Receptionist retrieved successfully.",
                Data = response
            });
        }

        [HttpGet("Pending")]
        public async Task<IActionResult> GetPendingReceptionists()
        {
            var receptionists = await _receptionistRepository.GetAsync(r => r.Status == ReceptionistStatus.Pending, includes: [r => r.User, r => r.Branch]);
            var response = receptionists.Select(r => new ReceptionistResponse
            {
                ReceptionistId = r.ReceptionistId,
                UserId = r.UserId,
                FirstName = r.User.FirstName,
                LastName = r.User.LastName,
                Email = r.User.Email!,
                PhoneNumbers = r.User.PhoneNumbers.Select(p => p.PhoneNumber).ToList(),
                BranchName = r.Branch.BranchName,
                ProfileImageUrl = $"{Request.Scheme}://{Request.Host}/images/profiles/{r.User.ProfileImg}",
                Status = r.Status
            });

            return Ok(new ApiResponse<IEnumerable<ReceptionistResponse>>
            {
                IsSuccess = true,
                Message = "Pending receptionists retrieved successfully.",
                Data = response
            });
        }

        [HttpPatch("{id:guid}/Approve")]
        public async Task<IActionResult> ApproveReceptionist(Guid id)
        {
            var receptionist = await _receptionistRepository.GetOneAsynch(r => r.ReceptionistId == id);

            if (receptionist == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Receptionist not found."
                });
            }

            if (receptionist.Status == ReceptionistStatus.Approved)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Receptionist is already approved."
                });
            }
            if (receptionist.Status == ReceptionistStatus.Rejected || receptionist.Status == ReceptionistStatus.Suspended)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "The Rejected or Suspended receptionist cannot be approved."
                });
            }

            receptionist.Status = ReceptionistStatus.Approved;
            _receptionistRepository.Update(receptionist);
            await _receptionistRepository.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Receptionist approved successfully."
            });
        }

        [HttpPatch("{id:guid}/Reject")]
        public async Task<IActionResult> RejectReceptionist(Guid id)
        {
            var receptionist = await _receptionistRepository.GetOneAsynch(r => r.ReceptionistId == id);

            if (receptionist == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Receptionist not found."
                });
            }

            if (receptionist.Status == ReceptionistStatus.Rejected)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Receptionist is already rejected."
                });
            }
            if (receptionist.Status == ReceptionistStatus.Approved || receptionist.Status == ReceptionistStatus.Suspended)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "The Approved or Suspended receptionist cannot be rejected."
                });
            }

            receptionist.Status = ReceptionistStatus.Rejected;
            _receptionistRepository.Update(receptionist);
            await _receptionistRepository.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Receptionist rejected successfully."
            });
        }
        [HttpPatch("{id:guid}/Suspend")]
        public async Task<IActionResult> SuspendReceptionist(Guid id)
        {
            var receptionist = await _receptionistRepository.GetOneAsynch(r => r.ReceptionistId == id);

            if (receptionist == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Receptionist not found."
                });
            }

            if (receptionist.Status == ReceptionistStatus.Suspended)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Receptionist is already suspended."
                });
            }

            if (receptionist.Status == ReceptionistStatus.Pending || receptionist.Status == ReceptionistStatus.Rejected)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Pending or Rejected receptionist cannot be suspended."
                });
            }

            receptionist.Status = ReceptionistStatus.Suspended;
            _receptionistRepository.Update(receptionist);
            await _receptionistRepository.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Receptionist suspended successfully."
            });
        }
        [HttpPatch("{id:guid}/Activate")]
        public async Task<IActionResult> ActivateReceptionist(Guid id)
        {
            var receptionist = await _receptionistRepository.GetOneAsynch(r => r.ReceptionistId == id);

            if (receptionist == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Receptionist not found."
                });
            }

            if (receptionist.Status == ReceptionistStatus.Approved)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Receptionist is already active."
                });
            }

            if (receptionist.Status == ReceptionistStatus.Pending || receptionist.Status == ReceptionistStatus.Rejected)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Pending or Rejected receptionist cannot be activated."
                });
            }

            receptionist.Status = ReceptionistStatus.Approved;
            _receptionistRepository.Update(receptionist);
            await _receptionistRepository.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Receptionist activated successfully."
            });
        }
    }
}
