const fs = require('fs');
const path = require('path');
function walk(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) files.push(...walk(full));
    else files.push(full);
  });
  return files;
}

const allFiles = walk(path.join(__dirname, '../src/app/storefront'));
let fixed = 0;
allFiles.filter(f => f.endsWith('.ts')).forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('standalone: true')) {
    // Check if its html uses translate
    const htmlFile = file.replace('.ts', '.html');
    let needsTranslate = content.includes('translate');
    if (fs.existsSync(htmlFile)) {
      if (fs.readFileSync(htmlFile, 'utf8').includes('translate')) {
         needsTranslate = true;
      }
    }
    
    if (needsTranslate && !content.includes('TranslatePipe')) {
       content = content.replace(/imports:\s*\[/, 'imports: [TranslatePipe, TranslateDirective, ');
       content = `import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';\n` + content;
       fs.writeFileSync(file, content, 'utf8');
       fixed++;
    }
  }
});
console.log('Fixed imports in', fixed, 'components');
