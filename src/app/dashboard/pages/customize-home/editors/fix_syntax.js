const fs = require('fs');
const path = require('path');

const dir = 'd:/Nexus/LUXIRA/loxxking/frontend/Front/src/app/dashboard/pages/customize-home/editors';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (!file.endsWith('-page-editor.component.ts') || file === 'home-page-editor.component.ts') continue;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix readonly private -> private readonly
  content = content.replace(/readonly\s+private\s+_config/g, 'private readonly _config');

  // Check if ngOnInit and ngOnDestroy are actually implemented
  if (content.includes('implements OnInit, OnDestroy') && !content.includes('ngOnInit() {')) {
    // This means the replacement of config = ... failed, let's just remove the implements clause
    content = content.replace(/implements OnInit, OnDestroy/g, '');
    // And remove the unused imports
    content = content.replace(/,\s*OnInit,\s*OnDestroy/, '');
    content = content.replace(/import \{ Subject, Subscription \} from 'rxjs';\nimport \{ debounceTime \} from 'rxjs\/operators';\n/, '');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Fixed syntax errors.');
