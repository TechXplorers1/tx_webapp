const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ManagerWorksheet.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('<ApplicationsTab')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
    // Print next 35 lines to see the props passed
    for (let i = index + 1; i < index + 36 && i < lines.length; i++) {
      console.log(`  ${i + 1}: ${lines[i]}`);
    }
  }
});
