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
        }
    }
}