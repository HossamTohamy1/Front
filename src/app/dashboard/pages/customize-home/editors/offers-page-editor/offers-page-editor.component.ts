import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SectionCardComponent } from '../../components/section-card/section-card.component';
import { BilingualInputComponent } from '../../components/bilingual-input/bilingual-input.component';
import { OffersPageConfigService, OffersPageConfig } from '../../../../../core/services/page-configs/offers-page-config.service';
import { getEnglishTranslation } from '../../../../../core/utils/config-sanitizer';

@Component({
  selector: 'app-offers-page-editor',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, SectionCardComponent, BilingualInputComponent],
  templateUrl: './offers-page-editor.component.html',
  styles: ``
})
export class OffersPageEditorComponent {
  private configService = inject(OffersPageConfigService);
  
  config = this.configService.pageConfig;

  constructor() {
    this.backfillLocalizedStrings();
  }

  backfillLocalizedStrings() {
    const c: any = { ...this.config() };
    let changed = false;
    const fields = [
      'heroTitle', 'heroSubtitle', 'currentOffersTitle',
      'bundlesTitle', 'bundlesSubtitle', 'multiBuyTitle',
      'limitedOfferTitle', 'limitedOfferSubtitle'
    ];

    for (const f of fields) {
      if (!c[f + 'Ar'] && c[f]) {
        c[f + 'Ar'] = c[f];
        changed = true;
      }
      if (!c[f + 'En']) {
        c[f + 'En'] = getEnglishTranslation(c[f + 'Ar'] || c[f] || '', '');
        changed = true;
      } else if (/[\u0600-\u06FF]/.test(c[f + 'En'])) {
        c[f + 'En'] = getEnglishTranslation(c[f + 'En'], '');
        changed = true;
      }
    }

    if (c.showHero === undefined) { c.showHero = true; changed = true; }
    if (c.showCurrentOffers === undefined) { c.showCurrentOffers = true; changed = true; }
    if (c.showBundles === undefined) { c.showBundles = true; changed = true; }
    if (c.showMultiBuy === undefined) { c.showMultiBuy = true; changed = true; }
    if (c.showLimitedOffer === undefined) { c.showLimitedOffer = true; changed = true; }

    if (changed) {
      this.configService.updateConfig(c);
    }
  }

  updateConfig(updates: Partial<OffersPageConfig>) {
    this.configService.updateConfig({
      ...this.config(),
      ...updates
    });
  }

  updateBilingualField(field: string, lang: 'Ar' | 'En', value: string) {
    const current = { ...this.config() } as any;
    current[field + lang] = value;
    current[field] = current[field + 'Ar'] || current[field + 'En'];
    this.configService.updateConfig(current);
  }
}
