const fs = require('fs');
const filesToFix = [
  'src/services/classService.ts',
  'src/features/dashboard/admin/AdminClassManagementPage.tsx',
  'src/features/dashboard/student/StudentDashboard.tsx',
  'src/features/dashboard/student/ClassDetailsPage.tsx',
  'src/features/dashboard/lecturer/LecturerDashboard.tsx'
];
for(const file of filesToFix) {
  if (fs.existsSync(file)) {
    // Read buffer to detect and strip BOM
    let buf = fs.readFileSync(file);
    let offset = 0;
    
    // Check for UTF-16 LE
    if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
      offset = 2;
    // Check for UTF-8
    } else if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
      offset = 3;
    // Check for UTF-16 BE
    } else if (buf.length >= 2 && buf[0] === 0xFE && buf[1] === 0xFF) {
      offset = 2;
    }
    
    // If it's UTF-16 LE from PowerShell
    let content;
    if (offset === 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
        content = buf.toString('utf16le');
    } else {
        if (offset > 0) {
            buf = buf.slice(offset);
        }
        content = buf.toString('utf8');
    }
    
    // Replace incorrectly escaped quotes
    content = content.replace(/\\"/g, '"');
    
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed: ' + file);
  }
}
