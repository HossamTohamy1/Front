const fs = require('fs');
const path = require('path');

const dir = 'e:/integration/frontend/loxxking/src/app/dashboard/pages/customize-home/editors';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.component.ts') && !f.includes('search-page-editor.component.ts') && !f.includes('home-page-editor.component.ts') && !f.includes('offers-page-editor.component.ts'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add rxjs imports
  if (!content.includes('import { Subject, Subscription }')) {
    content = content.replace(/import { Component.*? } from '@angular\/core';/g, "import { Component, inject, OnInit, OnDestroy } from '@angular/core';\nimport { Subject, Subscription } from 'rxjs';\nimport { debounceTime } from 'rxjs/operators';");
  }

  // 2. Add implements OnInit, OnDestroy
  content = content.replace(/export class (\w+EditorComponent) (?:implements \w+ )?{/, 'export class $1 implements OnInit, OnDestroy {');

  // 3. Replace config = this.configService.pageConfig;
  const configServiceRegex = /(?:private |readonly )?configService = inject\((.*?)\);/;
  const configMatch = content.match(configServiceRegex);
  
  if (configMatch) {
    const configLine = `config = this.configService.pageConfig;`;
    if (content.includes(configLine)) {
      content = content.replace(configLine, `
  localConfig: any = null;
  private updateSubject = new Subject<void>();
  private sub?: Subscription;

  ngOnInit() {
    this.initLocalConfig();
    this.sub = this.updateSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.flushSave();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private initLocalConfig() {
    const raw = this.configService.pageConfig();
    const c: any = JSON.parse(JSON.stringify(raw));
    this.localConfig = c;
    this.backfillLocalizedStrings();
  }

  private flushSave() {
    if (!this.localConfig) return;
    this.configService.updateConfig(JSON.parse(JSON.stringify(this.localConfig)));
  }`);

      // Modify backfillLocalizedStrings to use this.localConfig instead of this.config()
      content = content.replace(/const c: any = \{ \.\.\.this\.config\(\) \};/g, 'const c: any = this.localConfig;');
      content = content.replace(/if \(changed\) \{\s*this\.configService\.updateConfig\(c\);\s*\}/g, 'if (changed) {\n      this.flushSave();\n    }');
    }
  }

  // 4. Update updateBilingualField
  const updateBiRegex = /updateBilingualField\(field: string, lang: 'Ar' \| 'En', value: string\) \{[\s\S]*?\}/;
  content = content.replace(updateBiRegex, `updateBilingualField(field: string, lang: 'Ar' | 'En', value: string) {
    if (!this.localConfig) return;
    this.localConfig[field + lang] = value;
    this.localConfig[field] = this.localConfig[field + 'Ar'] || this.localConfig[field + 'En'];
    this.updateSubject.next();
  }`);

  // 5. Update updateConfig to use updateSubject instead
  const updateConfigRegex = /updateConfig\(updates: Partial<any>\) \{[\s\S]*?\}/;
  content = content.replace(updateConfigRegex, `updateConfig(updates: Partial<any>) {
    if (!this.localConfig) return;
    Object.assign(this.localConfig, updates);
    this.updateSubject.next();
  }`);

  // 6. Update HTML bindings
  // Replace config(). with localConfig.
  content = content.replace(/config\(\)\./g, 'localConfig?.');
  // Replace $any(config())['...'] with localConfig?.['...']
  content = content.replace(/\$any\(config\(\)\)\[/g, 'localConfig?.[');
  
  // Convert [valueAr]="..." to [(valueAr)]="..."
  content = content.replace(/\[valueAr\]="(localConfig\?\.\['(.*?)'\](?: \|\| '')?)"/g, '[(valueAr)]="localConfig.$2"');
  content = content.replace(/\[valueEn\]="(localConfig\?\.\['(.*?)'\](?: \|\| '')?)"/g, '[(valueEn)]="localConfig.$2"');

  // Convert array mutators
  content = content.replace(/const list = \[\.\.\.\(this\.config\(\)\.(\w+) \|\| \[\]\)\];/g, 'const list = [...(this.localConfig?.$1 || [])];');
  content = content.replace(/const badges = \[\.\.\.this\.config\(\)\.trustBadges\];/g, 'const badges = [...(this.localConfig?.trustBadges || [])];');
  content = content.replace(/this\.config\(\)\.categories/g, 'this.localConfig?.categories');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Refactored', file);
}
