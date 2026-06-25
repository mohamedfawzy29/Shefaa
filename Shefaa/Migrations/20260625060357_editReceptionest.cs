using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Shefaa.Migrations
{
    /// <inheritdoc />
    public partial class editReceptionest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Receptionist_AspNetUsers_UserId",
                table: "Receptionist");

            migrationBuilder.DropForeignKey(
                name: "FK_Receptionist_Branches_BranchId",
                table: "Receptionist");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Receptionist",
                table: "Receptionist");

            migrationBuilder.RenameTable(
                name: "Receptionist",
                newName: "Receptionists");

            migrationBuilder.RenameIndex(
                name: "IX_Receptionist_UserId",
                table: "Receptionists",
                newName: "IX_Receptionists_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Receptionist_BranchId",
                table: "Receptionists",
                newName: "IX_Receptionists_BranchId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Receptionists",
                table: "Receptionists",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Receptionists_AspNetUsers_UserId",
                table: "Receptionists",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Receptionists_Branches_BranchId",
                table: "Receptionists",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Receptionists_AspNetUsers_UserId",
                table: "Receptionists");

            migrationBuilder.DropForeignKey(
                name: "FK_Receptionists_Branches_BranchId",
                table: "Receptionists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Receptionists",
                table: "Receptionists");

            migrationBuilder.RenameTable(
                name: "Receptionists",
                newName: "Receptionist");

            migrationBuilder.RenameIndex(
                name: "IX_Receptionists_UserId",
                table: "Receptionist",
                newName: "IX_Receptionist_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Receptionists_BranchId",
                table: "Receptionist",
                newName: "IX_Receptionist_BranchId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Receptionist",
                table: "Receptionist",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Receptionist_AspNetUsers_UserId",
                table: "Receptionist",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Receptionist_Branches_BranchId",
                table: "Receptionist",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
