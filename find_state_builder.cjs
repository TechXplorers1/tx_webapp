const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ManagerWorksheet.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let start = -1;
lines.forEach((line, index) => {
  if (line.includes('const buildManagerClientState') || line.includes('function buildManagerClientState')) {
    start = index;
  }
});

if (start !== -1) {
  console.log(`Found buildManagerClientState at line ${start + 1}`);
  for (let i = start; i < start + 100 && i < lines.length; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
    if (lines[i].trim() === '};') {
      break;
    }
  }
} else {
  console.log("buildManagerClientState not found");
}
