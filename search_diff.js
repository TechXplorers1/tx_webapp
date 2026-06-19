const fs = require('fs');

const diffPath = 'c:\\Users\\Mannila Sandeep\\Desktop\\Techxplorers_New\\tx_webapp\\git_diff.txt';
const buffer = fs.readFileSync(diffPath);

console.log("Buffer length:", buffer.length);
console.log("First 100 bytes:", buffer.slice(0, 100).toString('hex'));

// Let's try parsing it as UTF-16 LE and UTF-8
const utf16Str = buffer.toString('utf16le');
const utf8Str = buffer.toString('utf8');

console.log("utf16Str lines:", utf16Str.split(/\r?\n/).length);
console.log("utf8Str lines:", utf8Str.split(/\r?\n/).length);

// Let's print the first 500 characters of whichever works better
if (utf16Str.includes('diff')) {
  console.log("Detected UTF-16 LE");
  const lines = utf16Str.split(/\r?\n/);
  lines.forEach((line, idx) => {
    if (line.startsWith('@@') || line.startsWith('diff')) {
      console.log(`${idx + 1}: ${line}`);
    }
  });
} else if (utf8Str.includes('diff')) {
  console.log("Detected UTF-8");
  const lines = utf8Str.split(/\r?\n/);
  lines.forEach((line, idx) => {
    if (line.startsWith('@@') || line.startsWith('diff')) {
      console.log(`${idx + 1}: ${line}`);
    }
  });
} else {
  console.log("Could not detect encoding!");
}
