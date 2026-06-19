const fs = require('fs');

const filePath = 'c:\\Users\\Mannila Sandeep\\Desktop\\Techxplorers_New\\tx_webapp\\src\\components\\ManagerWorksheet.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

let inEffect = false;
let braceCount = 0;
let effectCode = [];
let effectStartLine = 0;

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  
  if (line.includes('useEffect(')) {
    inEffect = true;
    braceCount = 0;
    effectCode = [];
    effectStartLine = lineNum;
  }
  
  if (inEffect) {
    effectCode.push(line);
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    braceCount += openBraces - closeBraces;
    
    // Check if we hit the closing parenthesis and bracket of useEffect
    if (braceCount <= 0 && line.includes(')')) {
      inEffect = false;
      console.log(`\n--- useEffect starting at line ${effectStartLine} ---`);
      console.log(effectCode.join('\n'));
    }
  }
});
