namespace Shefaa.DTOs.filter
{
    public class DoctorFilter
    {
        public string? SearchQuery { get; set; }      
        public Guid? SpecializationId { get; set; }   
          
        public string? OrderBy { get; set; }         
    }

}
