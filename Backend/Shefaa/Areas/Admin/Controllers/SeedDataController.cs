using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shefaa.DTOs.Response;
using Shefaa.Utilites.DBseeding;
using System.Threading.Tasks;

namespace Shefaa.Areas.Admin.Controllers
{
    [Area(CD.ADMIN_AREA)]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class SeedDataController : ControllerBase
    {
        private readonly IDummyDataSeeder _seeder;

        public SeedDataController(IDummyDataSeeder seeder)
        {
            _seeder = seeder;
        }

        [HttpPost("Generate")]
        public async Task<IActionResult> Generate()
        {
            try
            {
                await _seeder.SeedAsync();
                return Ok(new ApiResponse<object>
                {
                    IsSuccess = true,
                    Message = "Dummy data generated successfully!"
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, details = ex.ToString() });
            }
        }
    }
}
