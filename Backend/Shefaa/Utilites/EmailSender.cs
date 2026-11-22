using Microsoft.AspNetCore.Identity.UI.Services;
using System.Net;
using System.Net.Mail;

namespace Shefaa.Utilites
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailSender> _logger;

        public EmailSender(IConfiguration configuration, ILogger<EmailSender> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");

            var senderEmail = emailSettings["Email"];
            var password = emailSettings["Password"];
            var host = emailSettings["Host"];
            var port = emailSettings["Port"];

            if (string.IsNullOrWhiteSpace(senderEmail) || string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(port))
            {
                // In development without configured SMTP credentials, skip sending without crashing registration
                _logger.LogWarning("Email to {Email} was skipped (SMTP settings are incomplete). Content: {Html}", email, htmlMessage);
                return;
            }

            var client = new SmtpClient(host, int.Parse(port))
            {
                EnableSsl = true,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(senderEmail, password)
            };

            var mail = new MailMessage(from: senderEmail, to: email, subject, htmlMessage)
            {
                IsBodyHtml = true
            };

            try
            {
                await client.SendMailAsync(mail);
            }
            catch (Exception ex)
            {
                // A mail outage or bad SMTP credentials must not fail registration.
                // The message body is logged so the confirmation link is still reachable.
                _logger.LogError(ex, "Failed to send email to {Email}. Content: {Html}", email, htmlMessage);
            }
        }
    }
}