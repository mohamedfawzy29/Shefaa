using System.Security.Claims;

namespace Shefaa.Areas.Patient.Controllers
{
    [Area(CD.PATIENT_AREA)]
    [Route("api/Patient/[controller]")]
    [Authorize(Roles = CD.PATIENT_ROLE)]
    [ApiController]
    public class MedicalRecordController : ControllerBase
    {
        private readonly IRepository<MedicalRecord> _medicalRecordRepo;
        private readonly IRepository<Shefaa.Models.Patient> _patientRepo;

        public MedicalRecordController(
            IRepository<MedicalRecord> medicalRecordRepo,
            IRepository<Shefaa.Models.Patient> patientRepo)
        {
            _medicalRecordRepo = medicalRecordRepo;
            _patientRepo = patientRepo;
        }

        
        private async Task<Guid?> GetCurrentPatientIdAsync()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return null;

            Guid userGuid = Guid.Parse(userIdStr);
            var patient = await _patientRepo.GetOneAsynch(p => p.UserId == userGuid);
            return patient?.PatientId;
        }

        
        [HttpGet("myhistory")]
        public async Task<IActionResult> GetMyMedicalHistory()
        {
            var patientId = await GetCurrentPatientIdAsync();
            if (patientId == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "not found",
                    Errors = new[] { "Unauthorized patient account" }
                });
            }

            var history = await _medicalRecordRepo.GetAsync(
                filter: mr => mr.PatientId == patientId,
                includes: new System.Linq.Expressions.Expression<Func<MedicalRecord, object>>[]
                {
                    mr => mr.Doctor,
                    mr => mr.Doctor.User,
                    mr => mr.Appointment
                }
            );

            var sortedHistory = history.OrderByDescending(mr => mr.Appointment.AppointmentDate);

            
            return Ok(new ApiResponse<IEnumerable<MedicalRecord>>
            {
                IsSuccess = true,
                Message = "Data of midical history ",
                Data = sortedHistory
            });
        }

        
        [HttpGet("byappointment/{appointmentId}")]
        public async Task<IActionResult> GetRecordByAppointment(Guid appointmentId)
        {
            var patientId = await GetCurrentPatientIdAsync();
            if (patientId == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "un authorized",
                    Errors = new[] { "Unauthorized access" }
                });
            }

            var record = await _medicalRecordRepo.GetOneAsynch(
                filter: mr => mr.AppointmentId == appointmentId && mr.PatientId == patientId,
                includes: new System.Linq.Expressions.Expression<Func<MedicalRecord, object>>[]
                {
                    mr => mr.Doctor,
                    mr => mr.Doctor.User,
                    mr => mr.Appointment
                }
            );

            if (record == null)
            {
                return NotFound(new ApiResponse<MedicalRecord>
                {
                    IsSuccess = false,
                    Message = "not found.",
                    Errors = new[] { "Medical record not found" }
                });
            }

            return Ok(new ApiResponse<MedicalRecord>
            {
                IsSuccess = true,
                Message = "record fetch succesful",
                Data = record
            });
        }
    }
}
