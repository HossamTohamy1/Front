const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '../src/assets/i18n');
const enPath = path.join(i18nDir, 'en.json');
const arPath = path.join(i18nDir, 'ar.json');
let enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
let arJson = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const existingArToKey = {};
function traverseJson(objAr, prefix = '') {
  for (const k in objAr) {
    if (typeof objAr[k] === 'object' && objAr[k] !== null) {
      traverseJson(objAr[k], prefix + k + '.');
    } else {
      existingArToKey[objAr[k].trim()] = prefix + k;
    }
  }
}
traverseJson(arJson);

function findArabicFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findArabicFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (/[\u0600-\u06FF]/.test(content)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

const allFiles = findArabicFiles(path.join(__dirname, '../src/app/storefront'));

let autoCounter = 1;
const newMappings = {};

const uniqueArabicStrings = new Set();
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/[\u0600-\u06FF][\u0600-\u06FF\s0-9a-zA-Z\-_/]+/g);
  if (matches) {
    matches.forEach(m => {
      const str = m.trim();
      if (str.length > 1) uniqueArabicStrings.add(str);
    });
  }
});

Array.from(uniqueArabicStrings).sort((a,b) => b.length - a.length).forEach(arStr => {
  if (existingArToKey[arStr]) {
    newMappings[arStr] = existingArToKey[arStr];
  } else {
    const newKey = `STOREFRONT.AUTO_STR_${autoCounter++}`;
    newMappings[arStr] = newKey;
    
    if (!enJson.STOREFRONT) enJson.STOREFRONT = {};
    if (!arJson.STOREFRONT) arJson.STOREFRONT = {};
    
    enJson.STOREFRONT[`AUTO_STR_${autoCounter - 1}`] = `[EN] ${arStr}`;
    arJson.STOREFRONT[`AUTO_STR_${autoCounter - 1}`] = arStr;
  }
});

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(arPath, JSON.stringify(arJson, null, 2));

let filesChanged = 0;
allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  if (file.endsWith('.ts') && content.includes('standalone: true')) {
     if (!content.includes('TranslateModule') && !content.includes('TranslatePipe')) {
         content = content.replace(/imports:\s*\[/, 'imports: [TranslatePipe, TranslateDirective, ');
         content = `import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';\n` + content;
     }
  }

  const sortedStrs = Object.keys(newMappings).sort((a, b) => b.length - a.length);

  sortedStrs.forEach(arStr => {
    const key = newMappings[arStr];
    const safeArStr = arStr.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    
    const htmlTextRegex = new RegExp(`>\\s*${safeArStr}\\s*<`, 'g');
    content = content.replace(htmlTextRegex, `>{{ '${key}' | translate }}<`);

    const tsStrRegex1 = new RegExp(`'${safeArStr}'`, 'g');
    const tsStrRegex2 = new RegExp(`"${safeArStr}"`, 'g');
    const tsStrRegex3 = new RegExp(`\\\`${safeArStr}\\\``, 'g');
    
    if (file.endsWith('.ts')) {
        content = content.replace(tsStrRegex1, `'${key}'`);
        content = content.replace(tsStrRegex2, `'${key}'`);
        content = content.replace(tsStrRegex3, `'${key}'`);
    } else if (file.endsWith('.html')) {
        content = content.replace(tsStrRegex1, `'${key}'`);
        content = content.replace(tsStrRegex2, `'${key}'`);
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    filesChanged++;
  }
});

console.log('Files changed:', filesChanged);
console.log('New keys added:', autoCounter - 1);
