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
    
    // Replace isOpen={isOpen} with open={isOpen}
    content = content.replace(/isOpen=\{isOpen\}/g, 'open={isOpen}');
    content = content.replace(/isOpen=\{!!\w+\}/g, match => match.replace('isOpen=', 'open='));
    
    // Move description out of Modal props and into children
    // regex to match:
    // description="Some string"
    // >
    // (with optional whitespace/newlines)
    const descRegex = /description="([^"]+)"\s*>/g;
    content = content.replace(descRegex, (match, desc) => {
        return `>\n            <p className="text-sm text-slate-500 mb-4">${desc}</p>`;
    });

    fs.writeFileSync(filePath, content);
}

console.log("Done");
