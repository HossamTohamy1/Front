const fs = require('fs');
const path = require('path');

const dir = 'd:/Nexus/LUXIRA/loxxking/frontend/Front/src/app/dashboard/pages/customize-home/editors';
const files = fs.readdirSync(dir);

let updated = 0;
for (const file of files) {
  if (!file.endsWith('-page-editor.component.ts') || file === 'home-page-editor.component.ts') continue;

  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Need to add imports for Subject, Subscription, debounceTime, OnInit, OnDestroy if not present
  if (!content.includes('Subject')) {
    content = `import { Subject, Subscription } from 'rxjs';\nimport { debounceTime } from 'rxjs/operators';\n` + content;
  }
  
  if (!content.includes('OnInit')) {
    content = content.replace(/import \{ Component, (.*?)\} from '@angular\/core';/, "import { Component, OnInit, OnDestroy, $1} from '@angular/core';");
    if (!content.includes('OnInit')) { // Fallback if regex fails
        content = content.replace(/import \{ Component \}/, "import { Component, OnInit, OnDestroy }");
    }
  }

  // Find class declaration
  const classRegex = /export class (\w+) \{/;
  const match = content.match(classRegex);
  if (match) {
    const className = match[1];
    content = content.replace(classRegex, `export class ${className} implements OnInit, OnDestroy {`);
  }

  // Replace config = this.configService.pageConfig;
  const configDeclRegex = /config = this\.configService\.pageConfig;/;
  if (content.match(configDeclRegex)) {
    content = content.replace(configDeclRegex, `private _config = this.configService.pageConfig;
  localConfig: any = null;
  private updateSubj = new Subject<any>();
  private sub?: Subscription;

  ngOnInit() {
    this.localConfig = JSON.parse(JSON.stringify(this._config()));
    this.sub = this.updateSubj.pipe(debounceTime(400)).subscribe(c => {
      this.configService.updateConfig(c);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    if (this.localConfig) {
       this.configService.updateConfig(this.localConfig);
    }
  }

  config() {
    if (!this.localConfig) this.localConfig = JSON.parse(JSON.stringify(this._config()));
    return this.localConfig;
  }`);
  }

  // Replace updateConfig method
  const updateConfigRegex = /updateConfig\(updates: Partial<any>\) \{\s*this\.configService\.updateConfig\(\{ \.\.\.this\.config\(\), \.\.\.updates \}\);\s*\}/;
  if (content.match(updateConfigRegex)) {
    content = content.replace(updateConfigRegex, `updateConfig(updates: Partial<any>) {
    this.localConfig = { ...this.config(), ...updates };
    this.updateSubj.next(this.localConfig);
  }`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  updated++;
  console.log(`Updated ${file}`);
}
console.log(`Updated ${updated} editors.`);
