using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Shefaa.Migrations
{
    /// <inheritdoc />
    public partial class EditOTPModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Validto",
                table: "ApplicationUserOTPs",
                newName: "ValidTo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ValidTo",
                table: "ApplicationUserOTPs",
                newName: "Validto");
        }
    }
}
