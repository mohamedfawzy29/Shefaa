namespace Shefaa.Utilites.DBseeding
{
    public class DbInitializer : IDbInitializer
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DbInitializer> _logger;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public DbInitializer(ApplicationDbContext context, ILogger<DbInitializer> logger, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
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
                if (_context.Database.GetPendingMigrations().Any())
                {
                    _context.Database.Migrate();
                }
                if (!_roleManager.Roles.Any())
                {
                    await _roleManager.CreateAsync(new ApplicationRole { Name = CD.ADMIN_ROLE});
                    await _roleManager.CreateAsync(new ApplicationRole { Name = CD.DOCTOR_ROLE });
                    await _roleManager.CreateAsync(new ApplicationRole { Name = CD.RECEPTIONIST_ROLE });
                    await _roleManager.CreateAsync(new ApplicationRole { Name = CD.PATIENT_ROLE });

                    await _userManager.CreateAsync(new ApplicationUser()
                    {
                        FirstName = "Super",
                        LastName = "Admin",
                        UserName = "SuperAdmin",
                        Email = "superadmin@eraasoft.com",
                        EmailConfirmed = true
                    }, "SuperAdmin@123");

                    var user = await _userManager.FindByEmailAsync("superadmin@eraasoft.com");

                    await _userManager.AddToRoleAsync(user, CD.ADMIN_ROLE);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

        }
    }
}
