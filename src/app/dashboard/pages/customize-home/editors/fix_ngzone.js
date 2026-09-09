const fs = require('fs');
const path = require('path');
const dir = 'e:/integration/frontend/loxxking/src/app/core/services/page-configs';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.ts')) {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    if (!content.includes('NgZone')) {
      content = content.replace(/import \{([^}]+)\} from '@angular\/core';/, (match, p1) => {
        return `import {${p1}, NgZone, inject} from '@angular/core';`;
      });
      content = content.replace(/constructor\(\) \{/, `private zone = inject(NgZone);\n\n  constructor() {`);
      content = content.replace(/this\.pageConfig\.set\((.+?)\);/g, `this.zone.run(() => { this.pageConfig.set($1); });`);
      fs.writeFileSync(path.join(dir, file), content);
      console.log('Updated ' + file);
    }
  }
});
