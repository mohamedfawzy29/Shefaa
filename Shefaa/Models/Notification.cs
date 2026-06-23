using System.ComponentModel.DataAnnotations;

namespace Shefaa.Models
{
    public enum NotificationType
    {
        AppointmentReminder,
        NewMessage,
        PrescriptionUpdate,
        TestResultAvailable,
        HealthTip,
        SystemAlert
    }
    public class Notification
    {
        public Guid Id { get; set; }
        [MaxLength(100)]
        public required string Title { get; set; }
        public NotificationType Type { get; set; }
        public DateTime SendAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Body { get; set; }
        public bool IsRead { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}
