const fs = require('fs');
const path = require('path');
const dir = 'e:/integration/frontend/loxxking/src/app/core/services/page-configs';
const files = [
  'contact-page-config.service.ts',
  'login-page-config.service.ts',
  'notifications-page-config.service.ts',
  'offers-page-config.service.ts',
  'order-confirmation-page-config.service.ts',
  'profile-page-config.service.ts',
  'size-guide-page-config.service.ts'
];

const codeToInsert = `\nconst INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID \n  ? crypto.randomUUID() \n  : Math.random().toString(36).substring(2) + Date.now().toString(36);\n\n`;

files.forEach(file => {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');

  if (!content.includes('const INSTANCE_ID =')) {
    // Find @Injectable and insert before it
    content = content.replace(/@Injectable/, codeToInsert + '@Injectable');
    fs.writeFileSync(filepath, content);
    console.log('Fixed ' + file);
  }
});
