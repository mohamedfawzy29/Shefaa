using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shefaa.DTOs.dashboard;
using Shefaa.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;



namespace Shefaa.Areas.Admin.Controllers
{
    [Area(CD.ADMIN_AREA)]
    [Route("api/ [Area]/[controller]")]
    [Authorize(Roles = CD.ADMIN_ROLE)]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        UserManager<ApplicationUser> _userManager;

        public DashboardController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("counters")]
        public async Task<IActionResult> GetCounters()
        {
            var counters = new DBcounter
            {
                TotalUsers = await _userManager.Users.CountAsync(),
                TotalDoctors = await _context.Doctors.CountAsync(),
                TotalAppointments = await _context.Appointments.CountAsync(),
                TotalOrganizations = await _context.Organizations.CountAsync(),
            };

            return Ok(counters);
        }
        [HttpGet("appointment chart")]
        public async Task<IActionResult> GetAppointmentStatusChart()
        {
            var chartData = await _context.Appointments
                .GroupBy(a => a.Status)
                .Select(g => new
                {
                    Label = g.Key.ToString(), 
                    Value = g.Count()         
                })
                .ToListAsync();

            return Ok(chartData);
        }


        [HttpGet("top-specializations-chart")]
        public async Task<IActionResult> GetTopSpecializationsChart()
        {
            var chartData = await _context.Appointments
                .GroupBy(a => a.Doctor.Specialization.Name) 
                .Select(g => new
                {
                    Label = g.Key,         
                    Value = g.Count()      
                })
                .OrderByDescending(x => x.Value) 
                .Take(5)                         
                .ToListAsync();

            return Ok(chartData);
        }





    }
}
