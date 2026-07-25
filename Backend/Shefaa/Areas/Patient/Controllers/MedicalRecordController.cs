using System.Security.Claims;
namespace Shefaa.Areas.Patient.Controllers
{
    [Area(CD.PATIENT_AREA)]
    [Route("api/[area]/[controller]")]
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

            var response = sortedHistory.Select(mr => new
            {
                id = mr.Id,
                appointmentId = mr.AppointmentId,
                doctorId = mr.DoctorId,
                patientId = mr.PatientId,
                chiefComplaint = mr.ChiefComplaint,
                diagnosis = mr.Diagnosis,
                treatmentPlan = mr.TreatmentPlan,
                doctorNotes = mr.DoctorNotes,
                followUpDate = mr.FollowUpDate,
                doctor = mr.Doctor != null ? new
                {
                    doctorId = mr.Doctor.DoctorId,
                    user = mr.Doctor.User != null ? new
                    {
                        firstName = mr.Doctor.User.FirstName,
                        lastName = mr.Doctor.User.LastName,
                        profileImg = mr.Doctor.User.ProfileImg
                    } : null
                } : null,
                appointment = mr.Appointment != null ? new
                {
                    id = mr.Appointment.Id,
                    appointmentDate = mr.Appointment.AppointmentDate,
                    startTime = mr.Appointment.StartTime,
                    endTime = mr.Appointment.EndTime,
                    visitReason = mr.Appointment.VisitReason
                } : null
            });


            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "medical history ",
                Data = response
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
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "record not found",
                    Errors = new[] { "Medical record not found" }
                });
            }

            var response = new
            {
                id = record.Id,
                appointmentId = record.AppointmentId,
                doctorId = record.DoctorId,
                patientId = record.PatientId,
                chiefComplaint = record.ChiefComplaint,
                diagnosis = record.Diagnosis,
                treatmentPlan = record.TreatmentPlan,
                doctorNotes = record.DoctorNotes,
                followUpDate = record.FollowUpDate,
                doctor = record.Doctor != null ? new
                {
                    doctorId = record.Doctor.DoctorId,
                    user = record.Doctor.User != null ? new
                    {
                        firstName = record.Doctor.User.FirstName,
                        lastName = record.Doctor.User.LastName,
                        profileImg = record.Doctor.User.ProfileImg
                    } : null
                } : null,
                appointment = record.Appointment != null ? new
                {
                    id = record.Appointment.Id,
                    appointmentDate = record.Appointment.AppointmentDate,
                    startTime = record.Appointment.StartTime,
                    endTime = record.Appointment.EndTime,
                    visitReason = record.Appointment.VisitReason
                } : null
            };

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "record fetched successfully",
                Data = response
            });
        }
    }
}
