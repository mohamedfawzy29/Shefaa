
namespace Shefaa.Areas.Admin.Controllers
{
    [Area(CD.ADMIN_AREA)]
    [Route("api/[controller]")]
    [Authorize(Roles = CD.ADMIN_ROLE)]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        IRepository<Doctor> _doctorRepository;

        public DoctorController(IRepository<Doctor> doctorRepository)
        {
            _doctorRepository = doctorRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDoctors()
        {
            var doctors = await _doctorRepository.GetAsync(includes: [d => d.User, d => d.Specialization, d => d.User.PhoneNumbers]);
            var response = doctors.Select(d => new DoctorResponse
            {
                DoctorId = d.DoctorId,
                UserId = d.UserId,
                FirstName = d.User.FirstName,
                LastName = d.User.LastName,
                Email = d.User.Email!,
                PhoneNumbers = d.User.PhoneNumbers.Select(p => p.PhoneNumber).ToList(),
                ProfileImageUrl = $"{Request.Scheme}://{Request.Host}/images/profiles/{d.User.ProfileImg}",
                Specialization = d.Specialization.Name,
                LicenseNumber = d.LicenseNumber,
                YearsOfExperience = d.YearsOfExperience,
                AverageRating = d.AverageRating,
                Status = d.Status
            });

            return Ok(new ApiResponse<IEnumerable<DoctorResponse>>
            {
                IsSuccess = true,
                Message = "Doctors retrieved successfully.",
                Data = response
            });
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetDoctorById(Guid id)
        {
            var doctor = await _doctorRepository.GetOneAsynch(d => d.DoctorId == id, includes: [d => d.User, d => d.Specialization, d => d.User.PhoneNumbers]);
            if (doctor == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Doctor not found."
                });
            }
            var response = new DoctorResponse
            {
                DoctorId = doctor.DoctorId,
                UserId = doctor.UserId,
                FirstName = doctor.User.FirstName,
                LastName = doctor.User.LastName,
                Email = doctor.User.Email!,
                PhoneNumbers = doctor.User.PhoneNumbers.Select(p => p.PhoneNumber).ToList(),
                ProfileImageUrl = $"{Request.Scheme}://{Request.Host}/images/profiles/{doctor.User.ProfileImg}",
                Specialization = doctor.Specialization.Name,
                LicenseNumber = doctor.LicenseNumber,
                YearsOfExperience = doctor.YearsOfExperience,
                AverageRating = doctor.AverageRating,
                Status = doctor.Status
            };

            return Ok(new ApiResponse<DoctorResponse>
            {
                IsSuccess = true,
                Message = "Doctor retrieved successfully.",
                Data = response
            });
        }

        [HttpGet("Pending")]
        public async Task<IActionResult> GetPendingDoctors()
        {
            var doctors = await _doctorRepository.GetAsync(d => d.Status == DoctorStatus.Pending, includes: [ d => d.User, d => d.Specialization, d => d.User.PhoneNumbers]);
            var response = doctors.Select(d => new DoctorResponse
            {
                DoctorId = d.DoctorId,
                UserId = d.UserId,
                FirstName = d.User.FirstName,
                LastName = d.User.LastName,
                Email = d.User.Email!,
                PhoneNumbers = d.User.PhoneNumbers.Select(p => p.PhoneNumber).ToList(),
                ProfileImageUrl = $"{Request.Scheme}://{Request.Host}/images/profiles/{d.User.ProfileImg}",
                Specialization = d.Specialization.Name,
                LicenseNumber = d.LicenseNumber,
                YearsOfExperience = d.YearsOfExperience,
                AverageRating = d.AverageRating,
                Status = d.Status
            });

            return Ok(new ApiResponse<IEnumerable<DoctorResponse>>
            {
                IsSuccess = true,
                Message = "Pending doctors retrieved successfully.",
                Data = response
            });
        }

        [HttpPatch("{id:guid}/Approve")]
        public async Task<IActionResult> ApproveDoctor(Guid id)
        {
            var doctor = await _doctorRepository.GetOneAsynch(d => d.DoctorId == id);

            if (doctor == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Doctor not found."
                });
            }

            if (doctor.Status == DoctorStatus.Approved)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Doctor is already approved."
                });
            }
            if (doctor.Status == DoctorStatus.Rejected || doctor.Status == DoctorStatus.Suspended)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "The Rejected or Suspended doctor cannot be approved."
                });
            }

            doctor.Status = DoctorStatus.Approved;
            _doctorRepository.Update(doctor);
            await _doctorRepository.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Doctor approved successfully."
            });
        }
        [HttpPatch("{id:guid}/Reject")]
        public async Task<IActionResult> RejectDoctor(Guid id)
        {
            var doctor = await _doctorRepository.GetOneAsynch(d => d.DoctorId == id);

            if (doctor == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Doctor not found."
                });
            }

            if (doctor.Status == DoctorStatus.Rejected)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Doctor is already rejected."
                });
            }
            if (doctor.Status == DoctorStatus.Approved || doctor.Status == DoctorStatus.Suspended)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "The Approved or Suspended doctor cannot be rejected."
                });
            }

            doctor.Status = DoctorStatus.Rejected;
            _doctorRepository.Update(doctor);
            await _doctorRepository.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Doctor rejected successfully."
            });
        }
        [HttpPatch("{id:guid}/Suspend")]
        public async Task<IActionResult> SuspendDoctor(Guid id)
        {
            var doctor = await _doctorRepository.GetOneAsynch(d => d.DoctorId == id);

            if (doctor == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Doctor not found."
                });
            }

            if (doctor.Status == DoctorStatus.Suspended)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Doctor is already suspended."
                });
            }

            if (doctor.Status == DoctorStatus.Pending || doctor.Status == DoctorStatus.Rejected)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Pending or Rejected doctor cannot be suspended."
                });
            }

            doctor.Status = DoctorStatus.Suspended;
            _doctorRepository.Update(doctor);
            await _doctorRepository.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Doctor suspended successfully."
            });
        }
        [HttpPatch("{id:guid}/Activate")]
        public async Task<IActionResult> ActivateDoctor(Guid id)
        {
            var doctor = await _doctorRepository.GetOneAsynch(d => d.DoctorId == id);

            if (doctor == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Doctor not found."
                });
            }

            if (doctor.Status == DoctorStatus.Approved)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Doctor is already active."
                });
            }

            if (doctor.Status == DoctorStatus.Pending || doctor.Status == DoctorStatus.Rejected)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Pending or Rejected doctor cannot be activated."
                });
            }

            doctor.Status = DoctorStatus.Approved;
            _doctorRepository.Update(doctor);
            await _doctorRepository.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Doctor activated successfully."
            });
        }
    }
}
