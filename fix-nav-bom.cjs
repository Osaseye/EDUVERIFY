const fs = require('fs');

const filesToFix = [
  'src/features/dashboard/lecturer/EditClassPage.tsx',
  'src/features/dashboard/lecturer/LecturerDashboard.tsx',
  'src/features/dashboard/student/StudentDashboard.tsx'
];

for(const file of filesToFix) {
  if (fs.existsSync(file)) {
    let buf = fs.readFileSync(file);
    let offset = 0;
    
    // Check for UTF-16 LE
    if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
      offset = 2;
    } else if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
      offset = 3;
    } else if (buf.length >= 2 && buf[0] === 0xFE && buf[1] === 0xFF) {
      offset = 2;
    }
    
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
    
    // Fix broken template literals from the powershell output
    content = content.replace(/navigate\(\\\/lecturer\/edit-class\/\\\\\)/g, 'navigate(`/lecturer/edit-class/${cls.id}`)');
    content = content.replace(/navigate\(\\\/lecturer\/scanner\/\\\\\)/g, 'navigate(`/lecturer/scanner/${cls.id}`)');
    content = content.replace(/navigate\(\\\/student\/classes\/\\\\\)/g, 'navigate(`/student/classes/${cls.id}`)');
    
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
  }
}
