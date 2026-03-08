const fs = require('fs');
const files = [
  'src/features/dashboard/student/ClassDetailsPage.tsx',
  'src/features/dashboard/admin/AdminClassManagementPage.tsx',
  'src/features/dashboard/student/StudentDashboard.tsx',
  'src/features/dashboard/lecturer/LecturerDashboard.tsx'
];
files.forEach(f => {
  try {
    let str = fs.readFileSync(f, 'utf8');
    str = str.replace(/\\"/g, '"');
    fs.writeFileSync(f, str, 'utf8');
    console.log('Fixed', f);
  } catch(e) { console.error(e); }
});
