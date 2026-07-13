using System.Security.Claims;


namespace Shefaa.Areas.DoctorArea.Controllers
{
    [Area(CD.DOCTOR_AREA)]
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Authorize(Roles = CD.DOCTOR_ROLE)]
    public class DoctorMedicalController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorMedicalController(ApplicationDbContext context)
        {
            _context = context;
        }

     
        private async Task<Guid?> GetCurrentDoctorIdAsync()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return null;

            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == Guid.Parse(userIdClaim));
            return doctor?.DoctorId;
        }

        [HttpPost("CreatePrescription")]
        public async Task<IActionResult> CreatePrescription([FromBody] CreateMedicalRecordRequest request)
        {
            var doctorId = await GetCurrentDoctorIdAsync();
            if (doctorId == null)
                return Unauthorized(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Unauthorized."
                });

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == request.AppointmentId && a.DoctorId == doctorId);

            if (appointment == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "The specified appointment does not exist or does not belong to you."
                });
            }

            var recordExists = await _context.MedicalRecords.AnyAsync(m => m.AppointmentId == request.AppointmentId);
            if (recordExists)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "A prescription or medical record has already been created for this appointment."
                });
            }

            var medicalRecord = new MedicalRecord
            {
                Id = Guid.NewGuid(),
                AppointmentId = request.AppointmentId,
                DoctorId = doctorId.Value,
                PatientId = appointment.PatientId,
                ChiefComplaint = request.ChiefComplaint,
                Diagnosis = request.Diagnosis,
                TreatmentPlan = request.TreatmentPlan,
                DoctorNotes = request.DoctorNotes,
                FollowUpDate = request.FollowUpDate
            };


            _context.MedicalRecords.Add(medicalRecord);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Prescription and medical record created successfully, and appointment status updated to Completed."
            });
        }
    }
}