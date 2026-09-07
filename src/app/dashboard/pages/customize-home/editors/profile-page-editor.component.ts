import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePageConfigService } from '../../../../core/services/page-configs/profile-page-config.service';

@Component({
  selector: 'app-profile-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div class="bg-card border border-border rounded-2xl overflow-hidden mb-4">
        <div class="p-4 bg-muted/30 border-b border-border font-medium">رأس الصفحة (Header)</div>
        <div class="p-4 space-y-4">
          <div class="space-y-3 p-4">
            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_276' | translate }}</span>
              <input type="text" [ngModel]="config().headerTitle" (ngModelChange)="updateConfig('headerTitle', $event)" class="lk-input h-10 px-3 rounded-xl border border-border" />
            </label>
            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_363' | translate }}</span>
              <input type="text" [ngModel]="config().headerSubtitle" (ngModelChange)="updateConfig('headerSubtitle', $event)" class="lk-input h-10 px-3 rounded-xl border border-border" />
            </label>
          </div>
        </div>
      </div>
      
      <div class="bg-card border border-border rounded-2xl overflow-hidden mb-4">
        <div class="p-4 bg-muted/30 border-b border-border font-medium">{{ 'DASHBOARD.AUTO_STR_168' | translate }}</div>
        <div class="p-4 space-y-4">
          <div class="space-y-3 p-4">
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_45' | translate }}</span>
              <input type="checkbox" [checked]="config().showAvatarSection" (change)="updateCheckbox('showAvatarSection', $event)" class="lk-checkbox" />
            </label>
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_26' | translate }}</span>
              <input type="checkbox" [checked]="config().showBasicInfoSection" (change)="updateCheckbox('showBasicInfoSection', $event)" class="lk-checkbox" />
            </label>
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium">{{ 'DASHBOARD.AUTO_STR_147' | translate }}</span>
              <input type="checkbox" [checked]="config().showAddressSection" (change)="updateCheckbox('showAddressSection', $event)" class="lk-checkbox" />
            </label>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfilePageEditorComponent {
  readonly configService = inject(ProfilePageConfigService);
  readonly config = this.configService.pageConfig;

  updateConfig(key: string, value: any) {
    this.configService.updateConfig({ ...this.config(), [key]: value });
  }

  updateCheckbox(key: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.updateConfig(key, checked);
  }
}
