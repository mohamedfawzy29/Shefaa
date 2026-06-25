
namespace Shefaa.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        // Constructor
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSets for each entity
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Doctor> Doctors { get; set; } 
        public DbSet<Receptionist> Receptionists { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<BranchPhoneNumber> BranchPhoneNumbers { get; set; }
        public DbSet<DoctorBranch> DoctorBranchs { get; set; }
        public DbSet<DoctorSchedule> DoctorSchedules { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<UserPhoneNumber> UserPhoneNumbers { get; set; }
        public DbSet<ApplicationUserOTP> ApplicationUserOTPs { get; set; }

        //Fluent API configurations
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MedicalRecord>()
                .HasOne(m => m.Patient)
                .WithMany() 
                .HasForeignKey(m => m.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MedicalRecord>()
                .HasOne(m => m.Doctor)
                .WithMany()
                .HasForeignKey(m => m.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Patient)
                .WithMany() 
                .HasForeignKey(r => r.PatientId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Doctor)
                .WithMany() 
                .HasForeignKey(r => r.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserPhoneNumber>()
                .HasOne(up => up.User)
                .WithMany(u => u.PhoneNumbers)
                .HasForeignKey(up => up.UserId);

            modelBuilder.Entity<Doctor>()
                .HasOne(d => d.User)
                .WithOne(u => u.Doctor)
                .HasForeignKey<Doctor>(d => d.UserId);

            modelBuilder.Entity<Patient>()
                .HasOne(p => p.User)
                .WithOne(u => u.Patient)
                .HasForeignKey<Patient>(p => p.UserId);

            modelBuilder.Entity<Receptionist>()
                .HasOne(r => r.User)
                .WithOne(u => u.Receptionist)
                .HasForeignKey<Receptionist>(r => r.UserId);

        }
    }
}