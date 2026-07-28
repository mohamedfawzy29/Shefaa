using Microsoft.EntityFrameworkCore;
using Shefaa.Data;
using Shefaa.Models;
using Shefaa.Repositories;

namespace Shefaa.Utilites.DBseeding
{
    public class DbInitializer : IDbInitializer
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DbInitializer> _logger;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public DbInitializer(
            ApplicationDbContext context,
            ILogger<DbInitializer> logger,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task InitializeAsync()
        {
            try
            {
                if ((await _context.Database.GetPendingMigrationsAsync()).Any())
                {
                    await _context.Database.MigrateAsync();
                }

                await SeedRolesAsync();
                await SeedAdminsAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
        }

        private async Task SeedRolesAsync()
        {
            if (!await _roleManager.RoleExistsAsync(CD.ADMIN_ROLE))
            {
                await _roleManager.CreateAsync(new ApplicationRole
                {
                    Name = CD.ADMIN_ROLE
                });
            }

            if (!await _roleManager.RoleExistsAsync(CD.DOCTOR_ROLE))
            {
                await _roleManager.CreateAsync(new ApplicationRole
                {
                    Name = CD.DOCTOR_ROLE
                });
            }

            if (!await _roleManager.RoleExistsAsync(CD.RECEPTIONIST_ROLE))
            {
                await _roleManager.CreateAsync(new ApplicationRole
                {
                    Name = CD.RECEPTIONIST_ROLE
                });
            }

            if (!await _roleManager.RoleExistsAsync(CD.PATIENT_ROLE))
            {
                await _roleManager.CreateAsync(new ApplicationRole
                {
                    Name = CD.PATIENT_ROLE
                });
            }
        }

        private async Task SeedAdminsAsync()
        {
            var superAdmin = await _userManager.FindByEmailAsync("superadmin@eraasoft.com");

            if (superAdmin == null)
            {
                superAdmin = new ApplicationUser
                {
                    FirstName = "Super",
                    LastName = "Admin",
                    UserName = "SuperAdmin",
                    Email = "superadmin@eraasoft.com",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await _userManager.CreateAsync(superAdmin, "SuperAdmin@123");

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(superAdmin, CD.ADMIN_ROLE);
                }
            }

            var admin = await _userManager.FindByEmailAsync("mooFawzy29@eraasoft.com");

            if (admin == null)
            {
                admin = new ApplicationUser
                {
                    FirstName = "Mohamed",
                    LastName = "Admin",
                    UserName = "mooFawzy",
                    Email = "mooFawzy29@eraasoft.com",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await _userManager.CreateAsync(admin, "Admin@123");

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(admin, CD.ADMIN_ROLE);
                }
            }
        }
    }
}