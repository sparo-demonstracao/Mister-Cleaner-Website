import fs from 'fs';

const indexFile = 'src/index.css';
const appCssFile = 'temp-app/src/App.css';

// Read as string and strip BOM/zero-width space (U+FEFF and U+200B)
let indexContent = fs.readFileSync(indexFile, 'utf8').replace(/[\u200B-\u200D\uFEFF]/g, '');
let appCssContent = fs.readFileSync(appCssFile, 'utf8').replace(/[\u200B-\u200D\uFEFF]/g, '');

// Strip unexpected unicode sequence like   or similar artifacts that could have crept in via PS
indexContent = indexContent.replace(/\0/g, '');
appCssContent = appCssContent.replace(/\0/g, '');

// Also remove strange spacing
appCssContent = appCssContent.replace(/ \x00/g, '').replace(/\x00 /g, '').replace(/\x00/g, '');


// Remove any existing @import rules from both files
indexContent = indexContent.replace(/@import url[^;]+;/g, '');
appCssContent = appCssContent.replace(/@import url[^;]+;/g, '');

const finalImports = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700;1,900&display=swap');\n";

fs.writeFileSync(indexFile, finalImports + indexContent + '\n' + appCssContent);
console.log('Successfully fixed CSS imports and removed BOMs');
