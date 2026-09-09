import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '../../../../core/services/lang/lang.service';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule],
  templateUrl: './benefits.component.html'
})
export class BenefitsComponent {
  @Input() config?: any;
  private langService = inject(LangService);

  defaultBenefits = [
    { icon: 'cash', title: 'STOREFRONT.AUTO_STR_220', subtitle: 'STOREFRONT.AUTO_STR_204', isTranslateKey: true },
    { icon: 'delivery', title: 'COMMON.FASTDELIVERY', subtitle: 'STOREFRONT.AUTO_STR_289', isTranslateKey: true },
    { icon: 'exchange', title: 'STOREFRONT.AUTO_STR_347', subtitle: 'STOREFRONT.AUTO_STR_262', isTranslateKey: true },
  ];

  get displayBenefits(): any[] {
    if (!this.config?.benefits || !this.config.benefits.length) {
      return this.defaultBenefits;
    }

    const active = this.config.benefits.filter((b: any) => b.enabled !== false);
    if (!active.length) {
      return [];
    }

    const lang = this.langService.effectiveLang();

    return active.map((b: any) => {
      const text = (lang === 'en' && b.textEn) ? b.textEn : (b.textAr || b.text || '');
      return {
        icon: b.icon?.toLowerCase() === 'creditcard' ? 'cash' : b.icon?.toLowerCase() === 'refreshccw' ? 'exchange' : 'delivery',
        title: text ? text.split('\n')[0] : '',
        subtitle: text && text.split('\n')[1] ? text.split('\n')[1] : '',
        isTranslateKey: false
      };
    });
  }
}
