const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ManagerWorksheet.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const setters = ['setDailyApplicationCount', 'setFilteredApplicationCount', 'setSelectedEmployeeDailyCount'];

lines.forEach((line, index) => {
  setters.forEach(setter => {
    if (line.includes(setter)) {
      console.log(`${index + 1}: ${line.trim()}`);
    }
  });
});
