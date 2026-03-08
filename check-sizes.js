const fs = require('fs');
const dir = 'public/models';
let out = '';
try {
  out = fs.readdirSync(dir).map(f => f + ': ' + fs.statSync(dir + '/' + f).size).join('\n');
} catch (e) {
  out = e.toString();
}
fs.writeFileSync('sizes.txt', out);
