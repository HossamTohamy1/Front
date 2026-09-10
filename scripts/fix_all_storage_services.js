const fs = require('fs');
const path = require('path');

const dir = 'e:/integration/frontend/loxxking/src/app/core/services/page-configs';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (!file.endsWith('.service.ts')) return;
  if (file === 'search-page-config.service.ts') {
    console.log('Skipping search-page-config.service.ts (already updated)');
    return;
  }

  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  if (content.includes('isApplyingExternalUpdate')) {
    console.log(`Skipping ${file}, already has isApplyingExternalUpdate`);
    return;
  }

  // 1. Add fields before readonly pageConfig or after storageKey
  if (!content.includes('private isApplyingExternalUpdate = false;')) {
    content = content.replace(
      /(readonly pageConfig = signal)/,
      'private isApplyingExternalUpdate = false;\n  private lastSavedJson: string = \'\';\n\n  $1'
    );
  }

  // 2. In constructor, add lastSavedJson initialization and replace storage listener + effect
  // Pattern to match constructor body containing addEventListener and effect
  const ctorRegex = /constructor\(\)\s*\{([\s\S]*?effect\(\(\)\s*=>\s*\{[\s\S]*?\}\s*\);\s*\})/;
  
  // Specifically for home-page-config which has special setup:
  if (file === 'home-page-config.service.ts') {
    content = content.replace(
      /window\.addEventListener\('storage',[\s\S]*?\}\s*\);\s*\n\s*\/\/ 3\. Keep local cache[\s\S]*?\}\s*\);/,
      `this.lastSavedJson = JSON.stringify(this.pageConfig());

      window.addEventListener('storage', (e: StorageEvent) => {
        if ((e as any).__sourceInstanceId === INSTANCE_ID) return;

        if (e.key === this.storageKey && e.newValue) {
          if (e.newValue === this.lastSavedJson) return;

          try {
            const updated = JSON.parse(e.newValue);
            const merged = this.mergeWithInitial(updated);
            const mergedJson = JSON.stringify(merged);
            if (mergedJson === this.lastSavedJson) return;

            this.zone.run(() => {
              this.isApplyingExternalUpdate = true;
              this.lastSavedJson = mergedJson;
              this.pageConfig.set(merged);
              queueMicrotask(() => {
                this.isApplyingExternalUpdate = false;
              });
            });
          } catch (_) {}
        }
      });

      effect(() => {
        const config = this.pageConfig();
        const stringified = JSON.stringify(config);

        if (this.isApplyingExternalUpdate) return;
        if (stringified === this.lastSavedJson) return;

        this.lastSavedJson = stringified;
        try {
          localStorage.setItem(this.storageKey, stringified);
        } catch (_) {}

        try {
          const event = new StorageEvent('storage', {
            key: this.storageKey,
            newValue: stringified,
            storageArea: localStorage,
          });
          (event as any).__sourceInstanceId = INSTANCE_ID;
          window.dispatchEvent(event);
        } catch (_) {}
      });`
    );
  } else {
    // For standard page config services:
    const targetBlockRegex = /constructor\(\)\s*\{[\s\S]*?window\.addEventListener\('storage'[\s\S]*?\}\s*\);\s*\n\s*effect\(\(\)\s*=>\s*\{[\s\S]*?\}\s*\);\s*\}/;
    
    const replacement = `constructor() {
    this.lastSavedJson = JSON.stringify(this.pageConfig());

    window.addEventListener('storage', (e: StorageEvent) => {
      if ((e as any).__sourceInstanceId === INSTANCE_ID) return; // Discard self-triggered synthetic events

      if (e.key === this.storageKey && e.newValue) {
        if (e.newValue === this.lastSavedJson) return; // Discard echo / identical payload

        try {
          const updated = JSON.parse(e.newValue);
          const merged = this.mergeWithInitial(updated);
          const mergedJson = JSON.stringify(merged);
          if (mergedJson === this.lastSavedJson) return;

          this.zone.run(() => {
            this.isApplyingExternalUpdate = true;
            this.lastSavedJson = mergedJson;
            this.pageConfig.set(merged);
            queueMicrotask(() => {
              this.isApplyingExternalUpdate = false;
            });
          });
        } catch (_) {}
      }
    });

    effect(() => {
      const config = this.pageConfig();
      const stringified = JSON.stringify(config);

      if (this.isApplyingExternalUpdate) return;
      if (stringified === this.lastSavedJson) return;

      this.lastSavedJson = stringified;
      localStorage.setItem(this.storageKey, stringified);
      
      try {
        const event = new StorageEvent('storage', {
          key: this.storageKey,
          newValue: stringified,
          storageArea: localStorage,
        });
        (event as any).__sourceInstanceId = INSTANCE_ID;
        window.dispatchEvent(event);
      } catch (_) {}
    });
  }`;

    if (targetBlockRegex.test(content)) {
      content = content.replace(targetBlockRegex, replacement);
    } else {
      console.warn(`Could not match constructor in ${file}`);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated ${file}`);
  } else {
    console.warn(`No changes applied to ${file}`);
  }
});
