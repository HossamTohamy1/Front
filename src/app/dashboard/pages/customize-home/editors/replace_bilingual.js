const fs = require('fs');
const path = require('path');
const dir = 'e:/integration/frontend/loxxking/src/app/dashboard/pages/customize-home/editors';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.ts')) {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let originalContent = content;

    // Check if file uses bilingualInputTemplate
    if (content.includes('bilingualInputTemplate')) {
      
      // Import the component
      if (!content.includes('BilingualInputComponent')) {
        content = content.replace(/import \{([^}]+)\} from '@angular\/core';/, (match, p1) => {
            return `import {${p1}} from '@angular/core';\nimport { BilingualInputComponent } from '../components/bilingual-input/bilingual-input.component';`;
        });
        
        // Add to imports array
        content = content.replace(/imports: \[\s*([^\]]+)\s*\]/, (match, p1) => {
            if(!p1.includes('BilingualInputComponent')) {
                return `imports: [${p1}, BilingualInputComponent]`;
            }
            return match;
        });
      }

      // Replace <ng-container *ngTemplateOutlet="bilingualInputTemplate; context: { labelAr: '...', labelEn: '...', title: '...', field: '...' }"></ng-container>
      const regex = /<ng-container \*ngTemplateOutlet="bilingualInputTemplate;\s*context:\s*\{\s*labelAr:\s*'([^']+)',\s*labelEn:\s*'([^']+)',\s*title:\s*'([^']+)',\s*field:\s*'([^']+)'(?:,\s*isTextArea:\s*(true|false))?\s*\}"><\/ng-container>/g;
      
      content = content.replace(regex, (match, labelAr, labelEn, title, field, isTextArea) => {
          let textAreaProp = isTextArea === 'true' ? ' [isTextArea]="true"' : '';
          return `<app-bilingual-input title="${title}" labelAr="${labelAr}" labelEn="${labelEn}" 
                [valueAr]="$any(config())['${field}Ar'] || ''" 
                [valueEn]="$any(config())['${field}En'] || ''" 
                (valueChange)="updateBilingualField('${field}', $event.lang, $event.value)"${textAreaProp}></app-bilingual-input>`;
      });

      // Remove the <ng-template #bilingualInputTemplate ...> ... </ng-template> block
      // It's usually multi-line, so we can use a more generic replace or just let it be, but let's try to remove it
      content = content.replace(/<ng-template #bilingualInputTemplate[\s\S]*?<\/ng-template>/, '');

      if (content !== originalContent) {
        fs.writeFileSync(path.join(dir, file), content);
        console.log('Updated ' + file);
      }
    }
  }
});
