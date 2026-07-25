using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Shefaa.Data;
using Shefaa.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shefaa.Utilites.DBseeding
{
    public interface IDummyDataSeeder
    {
        Task SeedAsync();
    }

    public class DummyDataSeeder : IDummyDataSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        private static readonly Random Rand = new Random();

        private readonly string[] FirstNames = { "Ahmed", "Mohamed", "Mahmoud", "Ali", "Omar", "Sara", "Mona", "Nour", "Youssef", "Hassan" };
        private readonly string[] LastNames = { "Ibrahim", "Abdelrahman", "Yassin", "Sayed", "Tarek", "Magdy", "Hassan", "Kamel", "Mostafa", "Samy" };
        private readonly string[] OrgNames = { "Al Salam", "Dar Al Fouad", "Cleopatra", "Andalusia", "Saudi German", "Magdi Yacoub", "Al Shorouk", "Al Borg", "Alpha", "Nile" };
        private readonly string[] SpecNames = { "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "Dermatology", "Psychiatry", "Dentistry", "Ophthalmology", "Urology" };

        public DummyDataSeeder(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task SeedAsync()
        {
            try
            {
                // Generate Organizations
                var organizations = new List<Organization>();
                for (int i = 0; i < 10; i++)
                {
                    var uniqueId = Guid.NewGuid().ToString().Substring(0, 6);
                    organizations.Add(new Organization
                    {
                        Id = Guid.NewGuid(),
                        LegalName = OrgNames[i % OrgNames.Length] + " Medical Center " + uniqueId,
                        TaxNumber = Rand.Next(100000, 999999).ToString() + uniqueId,
                        MainEmail = $"info_{i}_{uniqueId}@org.com",
                        MainPhone = "010" + Rand.Next(10000000, 99999999),
                        Status = "Active"
                    });
                }
                _context.Organizations.AddRange(organizations);
                await _context.SaveChangesAsync();

                // Generate Branches
                var branches = new List<Branch>();
                foreach (var org in organizations)
                {
                    for (int i = 0; i < 2; i++)
                    {
                        var uniqueId = Guid.NewGuid().ToString().Substring(0, 6);
                        branches.Add(new Branch
                        {
                            Id = Guid.NewGuid(),
                            OrganizationId = org.Id,
                            BranchName = $"{org.LegalName} - Branch {i + 1}",
                            BranchEmail = $"branch_{i}_{uniqueId}@{org.Id.ToString().Substring(0, 5)}.com",
                            Country = "Egypt",
                            Governorate = "Cairo",
                            City = "Cairo",
                            Address = $"{RandomItem(FirstNames)} St, Cairo",
                            IsActive = true
                        });
                    }
                }
                _context.Branches.AddRange(branches);
                await _context.SaveChangesAsync();

                // Generate Specializations
                var specializations = new List<Specialization>();
                foreach (var specName in SpecNames)
                {
                    specializations.Add(new Specialization
                    {
                        Id = Guid.NewGuid(),
                        Name = specName,
                        Description = $"{specName} Department"
                    });
                }
                _context.Specializations.AddRange(specializations);
                await _context.SaveChangesAsync();

                // Helper to create users
                async Task<ApplicationUser> CreateUserAsync(string role, string prefix, int idx)
                {
                    var uniqueSuffix = Guid.NewGuid().ToString().Substring(0, 6);
                    var user = new ApplicationUser
                    {
                        UserName = $"{prefix}{idx}_{uniqueSuffix}@test.com",
                        Email = $"{prefix}{idx}_{uniqueSuffix}@test.com",
                        FirstName = RandomItem(FirstNames),
                        LastName = RandomItem(LastNames),
                        EmailConfirmed = true,
                        IsActive = true,
                        DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-Rand.Next(20, 60))),
                        Gender = Rand.Next(2) == 0 ? Gender.Male : Gender.Female
                    };
                    var result = await _userManager.CreateAsync(user, "Password123!");
                    if (!result.Succeeded)
                    {
                        throw new Exception($"Failed to create user {user.Email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    }
                    if (!string.IsNullOrEmpty(role))
                    {
                        await _userManager.AddToRoleAsync(user, role);
                    }
                    return user;
                }

                // Generate Doctors
                var doctors = new List<Doctor>();
                for (int i = 1; i <= 30; i++)
                {
                    var user = await CreateUserAsync(CD.DOCTOR_ROLE, "doctor", i);
                    
                    var doc = new Doctor
                    {
                        DoctorId = Guid.NewGuid(),
                        UserId = user.Id,
                        Status = DoctorStatus.Approved,
                        Bio = "Highly experienced doctor.",
                        YearsOfExperience = Rand.Next(1, 30),
                        LicenseNumber = "LIC-" + Rand.Next(1000, 9999),
                        AverageRating = 4.5,
                        SpecializationId = RandomItem(specializations).Id
                    };
                    doctors.Add(doc);
                    _context.Doctors.Add(doc);

                    // Add branches & schedules
                    var assignedBranches = branches.OrderBy(x => Rand.Next()).Take(Rand.Next(1, 3)).ToList();
                    foreach (var br in assignedBranches)
                    {
                        _context.DoctorBranches.Add(new DoctorBranch
                        {
                            DoctorId = doc.DoctorId,
                            BranchId = br.Id,
                            ConsultionFee = Rand.Next(200, 1000),
                            IsPrimary = br == assignedBranches.First()
                        });

                        _context.DoctorSchedules.Add(new DoctorSchedule
                        {
                            Id = Guid.NewGuid(),
                            DoctorId = doc.DoctorId,
                            BranchId = br.Id,
                            DayOfWeek = (DayOfWeek)Rand.Next(0, 7),
                            StartTime = new TimeSpan(9, 0, 0),
                            EndTime = new TimeSpan(17, 0, 0),
                            SlotDurationMinutes = 30,
                            MaxPatients = 15,
                            IsActive = true
                        });
                    }
                    await _context.SaveChangesAsync();
                }

                // Generate Patients
                var patients = new List<Patient>();
                for (int i = 1; i <= 50; i++)
                {
                    var user = await CreateUserAsync(CD.PATIENT_ROLE, "patient", i);
                    var patient = new Patient
                    {
                        PatientId = Guid.NewGuid(),
                        UserId = user.Id,
                        BloodType = "O+"
                    };
                    patients.Add(patient);
                    _context.Patients.Add(patient);
                    await _context.SaveChangesAsync();
                }

                // Generate Receptionists
                var receptionists = new List<Receptionist>();
                for (int i = 1; i <= 10; i++)
                {
                    var user = await CreateUserAsync(CD.RECEPTIONIST_ROLE, "receptionist", i);
                    var rec = new Receptionist
                    {
                        ReceptionistId = Guid.NewGuid(),
                        UserId = user.Id,
                        BranchId = RandomItem(branches).Id,
                        Status = ReceptionistStatus.Approved
                    };
                    receptionists.Add(rec);
                    _context.Receptionists.Add(rec);
                    await _context.SaveChangesAsync();
                }

                // Generate Appointments
                var appointments = new List<Appointment>();
                var today = DateOnly.FromDateTime(DateTime.Today);
                
                // Past appointments
                for (int i = 0; i < 50; i++)
                {
                    var doc = RandomItem(doctors);
                    var pat = RandomItem(patients);
                    var br = _context.DoctorBranches.FirstOrDefault(db => db.DoctorId == doc.DoctorId)?.BranchId ?? RandomItem(branches).Id;

                    appointments.Add(new Appointment
                    {
                        Id = Guid.NewGuid(),
                        DoctorId = doc.DoctorId,
                        PatientId = pat.PatientId,
                        BranchId = br,
                        AppointmentDate = today.AddDays(-Rand.Next(1, 30)),
                        StartTime = new TimeOnly(Rand.Next(9, 16), 0, 0),
                        EndTime = new TimeOnly(Rand.Next(10, 17), 0, 0),
                        Status = AppointmentStatus.Completed,
                        VisitReason = "General Checkup",
                        CreatedAt = DateTime.UtcNow.AddDays(-30),
                        UpdatedAt = DateTime.UtcNow
                    });
                }

                // Future appointments
                for (int i = 0; i < 30; i++)
                {
                    var doc = RandomItem(doctors);
                    var pat = RandomItem(patients);
                    var br = _context.DoctorBranches.FirstOrDefault(db => db.DoctorId == doc.DoctorId)?.BranchId ?? RandomItem(branches).Id;

                    appointments.Add(new Appointment
                    {
                        Id = Guid.NewGuid(),
                        DoctorId = doc.DoctorId,
                        PatientId = pat.PatientId,
                        BranchId = br,
                        AppointmentDate = today.AddDays(Rand.Next(1, 15)),
                        StartTime = new TimeOnly(Rand.Next(9, 16), 0, 0),
                        EndTime = new TimeOnly(Rand.Next(10, 17), 0, 0),
                        Status = AppointmentStatus.Scheduled,
                        VisitReason = "Follow up",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }

                // TODAY appointments
                for (int i = 0; i < 20; i++)
                {
                    var doc = RandomItem(doctors);
                    var pat = RandomItem(patients);
                    var br = _context.DoctorBranches.FirstOrDefault(db => db.DoctorId == doc.DoctorId)?.BranchId ?? RandomItem(branches).Id;

                    appointments.Add(new Appointment
                    {
                        Id = Guid.NewGuid(),
                        DoctorId = doc.DoctorId,
                        PatientId = pat.PatientId,
                        BranchId = br,
                        AppointmentDate = today,
                        StartTime = new TimeOnly(Rand.Next(9, 16), 0, 0),
                        EndTime = new TimeOnly(Rand.Next(10, 17), 0, 0),
                        Status = Rand.Next(10) > 5 ? AppointmentStatus.Scheduled : AppointmentStatus.CheckedIn,
                        VisitReason = "Today Checkup",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }

                _context.Appointments.AddRange(appointments);
                await _context.SaveChangesAsync();

                // Generate Medical Records & Reviews for Completed
                var completedApps = appointments.Where(a => a.Status == AppointmentStatus.Completed).ToList();
                foreach (var app in completedApps)
                {
                    _context.MedicalRecords.Add(new MedicalRecord
                    {
                        Id = Guid.NewGuid(),
                        AppointmentId = app.Id,
                        DoctorId = app.DoctorId,
                        PatientId = app.PatientId,
                        ChiefComplaint = "Headache",
                        Diagnosis = "Migraine",
                        TreatmentPlan = "Rest and Panadol",
                        DoctorNotes = "Patient needs more sleep",
                    });

                    if (Rand.Next(10) > 3) // 70% chance to have a review
                    {
                        _context.Reviews.Add(new Review
                        {
                            Id = Guid.NewGuid(),
                            AppointmentId = app.Id,
                            PatientId = app.PatientId,
                            Rating = Rand.Next(3, 6),
                            Comment = "Great doctor and excellent service!",
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Seeding failed: " + ex.Message, ex);
            }
        }

        private T RandomItem<T>(IList<T> items)
        {
            return items[Rand.Next(items.Count)];
        }
    }
}
