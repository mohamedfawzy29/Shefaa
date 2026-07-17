using Shefaa.DTOs.filter;
namespace Shefaa.Areas.Patient
{
    [Area(CD.PATIENT_AREA)]
    [Route("api/Patient/[controller]")]
    [Authorize(Roles = CD.PATIENT_ROLE)]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IRepository<Doctor> _doctorRepo;

        
        public DoctorController(IRepository<Doctor> doctorRepo)
        {
            _doctorRepo = doctorRepo;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetDoctors([FromQuery] DoctorFilter filter)
        {
            
            var doctors = await _doctorRepo.GetAsync(
                filter: d =>
                    (string.IsNullOrEmpty(filter.SearchQuery) || d.User.FirstName.Contains(filter.SearchQuery)) &&
                    (!filter.SpecializationId.HasValue || d.SpecializationId == filter.SpecializationId.Value),

                includes: new System.Linq.Expressions.Expression<Func<Doctor, object>>[]
                {
                    d => d.User,
                    d => d.Specialization
                    }
            );

            
            if (!string.IsNullOrEmpty(filter.OrderBy) && filter.OrderBy.ToLower() == "rating")
            {
                doctors = doctors.OrderByDescending(d => d.AverageRating);
            }

            return Ok(doctors);
        }

        
        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetDoctorDetails(Guid id)
        //{
            
        //    var doctor = await _doctorRepo.GetOneAsynch(
        //        filter: d => d.DoctorId == id,
        //        includes: new System.Linq.Expressions.Expression<Func<Doctor, object>>[]
        //        {
        //            d => d.User,
        //            d => d.Specialization,
        //            d => d.DoctorSchedules, 
        //            d => d.Reviews         
        //        }
        //    );

        //    if (doctor == null)
        //    {
        //        return NotFound(new { Message ="Sorry doctor not found" });
        //    }

        //    return Ok(doctor);
        //}
    }
}
