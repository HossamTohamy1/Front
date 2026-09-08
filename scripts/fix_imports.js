const fs = require('fs');
const path = require('path');
function findArabicFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findArabicFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('TranslateModule')) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

const allFiles = [
  ...findArabicFiles(path.join(__dirname, '../src/app/dashboard/components')),
  ...findArabicFiles(path.join(__dirname, '../src/app/dashboard/facades')),
  ...findArabicFiles(path.join(__dirname, '../src/app/shared'))
];

let filesChanged = 0;
allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import\s*\{\s*TranslateModule\s*\}\s*from\s*'@ngx-translate\/core';/, `import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';`);
  content = content.replace(/TranslateModule,/g, 'TranslatePipe, TranslateDirective,');
  content = content.replace(/TranslateModule/g, 'TranslatePipe, TranslateDirective');
  fs.writeFileSync(file, content, 'utf8');
  filesChanged++;
});

console.log('Fixed imports in', filesChanged, 'files');
