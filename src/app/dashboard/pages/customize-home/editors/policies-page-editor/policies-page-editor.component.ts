import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoliciesPageConfigService, PolicyConfig, PoliciesPageConfig } from '../../../../../core/services/page-configs/policies-page-config.service';
import { LucideAngularModule, Trash2 } from 'lucide-angular';
import { SectionCardComponent } from '../../components/section-card/section-card.component';

@Component({
  selector: 'app-policies-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule, SectionCardComponent],
  templateUrl: './policies-page-editor.component.html',
  styles: ``
})
export class PoliciesPageEditorComponent {
  private configService = inject(PoliciesPageConfigService);
  
  readonly Trash2 = Trash2;

  config: Signal<PoliciesPageConfig> = this.configService.pageConfig;

  updateConfig(updates: Partial<PoliciesPageConfig>) {
    this.configService.updateConfig({
      ...this.config(),
      ...updates
    });
  }

  addPolicy = () => {
    const policies = [...this.config().policies];
    policies.push({
      key: 'p-' + Date.now(),
      gridTitle: 'DASHBOARD.AUTO_STR_335',
      gridDescription: 'DASHBOARD.AUTO_STR_104',
      icon: 'FileText',
      title: 'DASHBOARD.AUTO_STR_85',
      subtitle: 'DASHBOARD.AUTO_STR_391',
      heroIcon: 'FileText',
      showWhatsApp: true,
      sections: []
    });
    this.updateConfig({ policies });
  }

  updatePolicy(index: number, updates: Partial<PolicyConfig>) {
    const policies = [...this.config().policies];
    policies[index] = { ...policies[index], ...updates };
    this.updateConfig({ policies });
  }

  removePolicy(index: number) {
    const policies = [...this.config().policies];
    policies.splice(index, 1);
    this.updateConfig({ policies });
  }
}
