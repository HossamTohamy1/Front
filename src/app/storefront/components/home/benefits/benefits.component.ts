import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule],
  templateUrl: './benefits.component.html'
})
export class BenefitsComponent implements OnInit {
  @Input() config?: any;

  defaultBenefits = [
    { icon: 'cash', title: 'STOREFRONT.AUTO_STR_220', subtitle: 'STOREFRONT.AUTO_STR_204' },
    { icon: 'delivery', title: 'COMMON.FASTDELIVERY', subtitle: 'STOREFRONT.AUTO_STR_289' },
    { icon: 'exchange', title: 'STOREFRONT.AUTO_STR_347', subtitle: 'STOREFRONT.AUTO_STR_262' },
  ];

  displayBenefits: any[] = [];

  ngOnInit() {
    this.displayBenefits = this.config?.benefits?.length 
      ? this.config.benefits.filter((b: any) => b.enabled).map((b: any) => ({
          icon: b.icon.toLowerCase() === 'creditcard' ? 'cash' : b.icon.toLowerCase() === 'refreshccw' ? 'exchange' : 'delivery',
          title: b.text.split('\n')[0],
          subtitle: b.text.split('\n')[1] || ''
        }))
      : this.defaultBenefits;
  }
}
