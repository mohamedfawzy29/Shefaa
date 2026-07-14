
namespace Shefaa.Areas.Patient
{
    [Area(CD.PATIENT_AREA)]
    [Route("api/Patient/[controller]")]
    [Authorize(Roles = CD.PATIENT_ROLE)]
    [ApiController]
    public class MedicalRecordController : ControllerBase
    {
    }
}
