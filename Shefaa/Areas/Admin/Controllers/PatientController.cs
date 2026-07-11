using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Shefaa.Areas.Admin.Controllers
{
    [Area(CD.ADMIN_AREA)]
    [Route("api/[controller]")]
    [Authorize(Roles = CD.ADMIN_ROLE)]
    [ApiController]
    public class PatientController : ControllerBase
    {
        IRepository<Patient> _patientRepository;
        UserManager<ApplicationUser> _userManager;

        public PatientController(IRepository<Patient> patientRepository, UserManager<ApplicationUser> userManager)
        {
            _patientRepository = patientRepository;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _patientRepository.GetAsync(includes: [p => p.User, p => p.User.PhoneNumbers]);
            var response = new List<PatientResponse>();

            foreach (var patient in patients)
            {
                response.Add(new PatientResponse
                {
                    PatientId = patient.PatientId,
                    UserId = patient.UserId,
                    FirstName = patient.User.FirstName,
                    LastName = patient.User.LastName,
                    Email = patient.User.Email!,
                    PhoneNumbers = patient.User.PhoneNumbers.Select(p => p.PhoneNumber).ToList(),
                    Address = patient.Address,
                    NationalId = patient.NationalId,
                    EmergencyContact = patient.EmergencyContact,
                    BloodType = patient.BloodType,
                    ProfileImageUrl = patient.User.ProfileImg,
                    IsActive = patient.User.IsActive,
                    IsLockedOut = await _userManager.IsLockedOutAsync(patient.User)
                });
            }

            return Ok(new ApiResponse<List<PatientResponse>>
            {
                IsSuccess = true,
                Message = "Patients retrieved successfully.",
                Data = response
            });
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetPatientById(Guid id)
        {
            var patient = await _patientRepository.GetOneAsynch(p => p.PatientId == id, includes: [p => p.User, p => p.User.PhoneNumbers]);

            if (patient == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Patient not found."
                });
            }

            var response = new PatientResponse
            {
                PatientId = patient.PatientId,
                UserId = patient.UserId,
                FirstName = patient.User.FirstName,
                LastName = patient.User.LastName,
                Email = patient.User.Email!,
                PhoneNumbers = patient.User.PhoneNumbers.Select(p => p.PhoneNumber).ToList(),
                Address = patient.Address,
                NationalId = patient.NationalId,
                EmergencyContact = patient.EmergencyContact,
                BloodType = patient.BloodType,
                ProfileImageUrl = patient.User.ProfileImg,
                IsActive = patient.User.IsActive,
                IsLockedOut = await _userManager.IsLockedOutAsync(patient.User)
            };

            return Ok(new ApiResponse<PatientResponse>
            {
                IsSuccess = true,
                Message = "Patient retrieved successfully.",
                Data = response
            });
        }
    }
}
