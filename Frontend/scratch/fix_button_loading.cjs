const fs = require('fs');
const path = require('path');

const files = [
    "src/features/reviews/components/dialogs/DeleteReviewDialog.tsx",
    "src/features/receptionist/components/dialogs/CreateReceptionistDialog.tsx",
    "src/features/organizations/components/dialogs/CreateOrganizationDialog.tsx",
    "src/features/organizations/components/dialogs/DeleteOrganizationDialog.tsx",
    "src/features/organizations/components/dialogs/EditOrganizationDialog.tsx",
    "src/features/branches/components/dialogs/CreateBranchDialog.tsx",
    "src/features/branches/components/dialogs/DeleteBranchDialog.tsx",
    "src/features/branches/components/dialogs/EditBranchDialog.tsx"
];

for (const file of files) {
    const filePath = path.join(__dirname, "..", file);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace Button isLoading with loading
    content = content.replace(/isLoading=\{([^}]+)\}/g, 'loading={$1}');

    fs.writeFileSync(filePath, content);
}

console.log("Done");
