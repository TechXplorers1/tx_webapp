const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ManagerWorksheet.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const keywords = ['dailyApplicationCount', 'filteredApplicationCount', 'selectedEmployeeDailyCount'];

lines.forEach((line, index) => {
  keywords.forEach(keyword => {
    if (line.includes(keyword)) {
      console.log(`${index + 1}: ${line.trim()}`);
    }
  });
});
