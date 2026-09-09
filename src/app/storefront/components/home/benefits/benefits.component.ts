import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule],
  templateUrl: './benefits.component.html'
})
export class BenefitsComponent {
  @Input() config?: any;

  defaultBenefits = [
    { icon: 'cash', title: 'STOREFRONT.AUTO_STR_220', subtitle: 'STOREFRONT.AUTO_STR_204' },
    { icon: 'delivery', title: 'COMMON.FASTDELIVERY', subtitle: 'STOREFRONT.AUTO_STR_289' },
    { icon: 'exchange', title: 'STOREFRONT.AUTO_STR_347', subtitle: 'STOREFRONT.AUTO_STR_262' },
  ];

  get displayBenefits(): any[] {
    if (!this.config?.benefits || !this.config.benefits.length) {
      return this.defaultBenefits;
    }

    const active = this.config.benefits.filter((b: any) => b.enabled !== false);
    if (!active.length) {
      return [];
    }

    return active.map((b: any) => ({
      icon: b.icon?.toLowerCase() === 'creditcard' ? 'cash' : b.icon?.toLowerCase() === 'refreshccw' ? 'exchange' : 'delivery',
      title: b.text ? b.text.split('\n')[0] : '',
      subtitle: b.text && b.text.split('\n')[1] ? b.text.split('\n')[1] : ''
    }));
  }
}
