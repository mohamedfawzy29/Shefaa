using Mapster;
using Shefaa.DTOs.Request;
using Shefaa.DTOs.Response;
using Shefaa.Models;

namespace Shefaa.Configurations
{
    public static class MapsterConfig
    {
        public static void RegisterMappings()
        {
            TypeAdapterConfig<UpdateOrganizationRequest, Organization>.NewConfig().IgnoreNullValues(true);

            TypeAdapterConfig<UpdateBranchRequest, Branch>.NewConfig().IgnoreNullValues(true);
            TypeAdapterConfig<Branch, BranchResponse>.NewConfig().Map(dest => dest.OrganizationName,src => src.Organization.LegalName);

            TypeAdapterConfig<UpdateSpecializationRequest, Specialization>.NewConfig().IgnoreNullValues(true);

            TypeAdapterConfig<Appointment, DoctorAppointmentResponse>.NewConfig()
                .Map(dest => dest.AppointmentId, src => src.Id)
                .Map(dest => dest.PatientName, src => src.Patient.User != null ? $"{src.Patient.User.FirstName} {src.Patient.User.LastName}" : "مريض غير معروف")
                .Map(dest => dest.BranchName, src => src.Branch.BranchName);
        }
    }
}