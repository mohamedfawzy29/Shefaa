
namespace Shefaa.Areas.Admin.Controllers
{
    [Area(CD.ADMIN_AREA)]
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Authorize(Roles = CD.ADMIN_ROLE)]
    public class SpecializationsController : ControllerBase
    {
        private readonly IRepository<Specialization> _specializationRepository;

        public SpecializationsController(IRepository<Specialization> specializationRepository)
        {
            _specializationRepository = specializationRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var specializations = await _specializationRepository.GetAsync();

            var response = specializations.Adapt<List<SpecializationResponse>>();

            return Ok(new ApiResponse<IEnumerable<SpecializationResponse>>
            {
                IsSuccess = true,
                Message = "Specializations retrieved successfully",
                Data = response
            });
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var specialization = await _specializationRepository.GetOneAsynch(s => s.Id == id);

            if (specialization == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Specialization not found"
                });
            }

            var response = specialization.Adapt<SpecializationResponse>();

            return Ok(new ApiResponse<SpecializationResponse>
            {
                IsSuccess = true,
                Message = "Specialization retrieved successfully",
                Data = response
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateSpecializationRequest request)
        {
            var specialization = request.Adapt<Specialization>();

            if (await _specializationRepository.ExistsAsync(s => s.Name == specialization.Name))
            {
                return Conflict(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "this specialization already exists"
                });
            }

            await _specializationRepository.AddAsync(specialization);
            await _specializationRepository.CommitChangesAsync();

            var response = specialization.Adapt<SpecializationResponse>();

            return CreatedAtAction(nameof(GetById), new { id = specialization.Id },
                new ApiResponse<SpecializationResponse>
                {
                    IsSuccess = true,
                    Message = "Specialization created successfully",
                    Data = response
                });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateSpecializationRequest request)
        {
            var specialization = await _specializationRepository.GetOneAsynch(s => s.Id == id, trackChanges: true);

            if (specialization == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Specialization not found"
                });
            }

            request.Adapt(specialization);

            await _specializationRepository.CommitChangesAsync();

            return Ok(new ApiResponse<SpecializationResponse>
            {
                IsSuccess = true,
                Message = "Specialization updated successfully",
                Data = specialization.Adapt<SpecializationResponse>()
            });
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var specialization = await _specializationRepository.GetOneAsynch(s => s.Id == id, includes: [s => s.Doctors],trackChanges: true);

            if (specialization == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Specialization not found"
                });
            }
            if (specialization.Doctors.Any())
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Cannot delete specialization because it has doctors."
                });
            }

            _specializationRepository.Delete(specialization);
            await _specializationRepository.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Specialization deleted successfully"
            });
        }
    }
}
