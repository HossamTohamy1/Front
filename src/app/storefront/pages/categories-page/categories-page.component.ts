import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';
import { LucideAngularModule, ChevronLeft, ArrowRight } from 'lucide-angular';

import { TranslateService } from '@ngx-translate/core';
import { LangService } from '../../../core/services/lang/lang.service';
import { LocalizeFieldPipe } from '../../../shared/pipes/localize-field.pipe';
import { CategoriesPageConfigService } from '../../../core/services/page-configs/categories-page-config.service';



@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink, StoreLayoutComponent, HomeHeaderComponent, LucideAngularModule, LocalizeFieldPipe],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css'
})
export class CategoriesPageComponent {
  configService = inject(CategoriesPageConfigService);
  pageConfig = this.configService.pageConfig;

  readonly ChevronLeft = ChevronLeft;
  readonly ArrowRight = ArrowRight;
  readonly langService = inject(LangService);
  private translate = inject(TranslateService);

  getStoreCategories() {
    const config = this.pageConfig();
    const images: Record<string, { image: string, imageAlt: string, imagePosition?: string }> = {
      'men': { image: '/assets/categories/category-men-reference.png', imageAlt: 'STOREFRONT.AUTO_STR_102', imagePosition: 'center center' },
      'women': { image: '/assets/categories/category-women-reference.png', imageAlt: 'STOREFRONT.AUTO_STR_88', imagePosition: 'center center' },
      'postpartum': { image: '/assets/categories/category-postpartum-reference.png', imageAlt: 'STOREFRONT.AUTO_STR_72', imagePosition: 'center center' },
      'sport': { image: '/assets/categories/category-sport-reference.png', imageAlt: 'STOREFRONT.AUTO_STR_89', imagePosition: 'center center' },
      'full-body': { image: '/assets/categories/category-full-body-reference.png', imageAlt: 'STOREFRONT.AUTO_STR_90', imagePosition: 'center center' },
      'waist': { image: '/assets/categories/category-waist-reference.png', imageAlt: 'STOREFRONT.AUTO_STR_420', imagePosition: 'center top' }
    };

    return config.categories.map(cat => ({
      ...cat,
      ...(images[cat.id] || { image: '', imageAlt: '' })
    }));
  }

  splitDescription(desc: string): string[] {
    const text = this.translate.instant(desc);
    return (text || desc || '').split('\n');
  }
}
