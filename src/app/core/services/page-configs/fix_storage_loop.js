const fs = require('fs');
const path = require('path');
const dir = 'e:/integration/frontend/loxxking/src/app/core/services/page-configs';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.ts')) {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let originalContent = content;

    // Check if it has window.addEventListener('storage', ...)
    if (content.includes("window.addEventListener('storage'")) {

      // If it doesn't have INSTANCE_ID defined at the top
      if (!content.includes('const INSTANCE_ID =')) {
        content = content.replace(/export interface /, "const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID \n  ? crypto.randomUUID() \n  : Math.random().toString(36).substring(2) + Date.now().toString(36);\n\nexport interface ");
      } else if (!content.includes('INSTANCE_ID =')) {
        // Just in case interface isn't there
        content = content.replace(/@Injectable/, "const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID \n  ? crypto.randomUUID() \n  : Math.random().toString(36).substring(2) + Date.now().toString(36);\n\n@Injectable");
      }

      // Inside addEventListener, discard synthetic events
      if (!content.includes('__sourceInstanceId === INSTANCE_ID')) {
        content = content.replace(/window\.addEventListener\('storage',\s*\([^)]*\)\s*=>\s*\{/, (match) => {
          return `${match}\n      if ((e as any).__sourceInstanceId === INSTANCE_ID) return; // Discard self-triggered synthetic events\n`;
        });
      }

      // Add __sourceInstanceId to the dispatched event
      if (!content.includes('__sourceInstanceId = INSTANCE_ID')) {
        content = content.replace(/window\.dispatchEvent\([^)]+\);/, (match) => {
          return `const event = new StorageEvent('storage', {
          key: this.storageKey,
          newValue: JSON.stringify(config),
          storageArea: localStorage,
        });
        (event as any).__sourceInstanceId = INSTANCE_ID;
        window.dispatchEvent(event);`;
        });

        // Remove the old dispatchEvent which was inside try block, wait, the replace above might replace the old one, but let's check
        // The old code:
        // window.dispatchEvent(new StorageEvent('storage', {
        //   key: this.storageKey,
        //   newValue: JSON.stringify(config),
        //   storageArea: localStorage,
        // }));
        content = content.replace(/window\.dispatchEvent\(new StorageEvent\('storage',\s*\{\s*key:\s*this\.storageKey,\s*newValue:\s*JSON\.stringify\(config\),\s*storageArea:\s*localStorage,?\s*\}\)\);/g, `const event = new StorageEvent('storage', {
          key: this.storageKey,
          newValue: JSON.stringify(config),
          storageArea: localStorage,
        });
        (event as any).__sourceInstanceId = INSTANCE_ID;
        window.dispatchEvent(event);`);
      }

      if (content !== originalContent) {
        fs.writeFileSync(path.join(dir, file), content);
        console.log('Fixed storage loop in ' + file);
      }
    }
  }
});
