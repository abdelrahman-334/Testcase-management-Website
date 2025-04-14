const fs = require('fs');
const path = require('path');

const filesToCopy = [
  {
    from: path.join(__dirname, 'src', 'reporting', 'customJsonReporter.js'),
    to: path.join(__dirname, 'dist', 'src', 'reporting', 'customJsonReporter.js')
  }
];

filesToCopy.forEach(({ from, to }) => {
  const dir = path.dirname(to);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(from, to);
  console.log(`✅ Copied ${from} -> ${to}`);
});