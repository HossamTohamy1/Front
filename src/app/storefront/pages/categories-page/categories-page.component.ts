import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';
import { LucideAngularModule, ChevronLeft, ArrowRight } from 'lucide-angular';

import { TranslateService } from '@ngx-translate/core';
import { LangService } from '../../../core/services/lang/lang.service';

export interface CategoryCardConfig {
  id: string;
  title: string;
  accent: string;
  description: string;
  path: string;
}

export interface CategoriesPageConfig {
  showTitle: boolean;
  headerTitle: string;
  headerSubtitle: string;
  categories: CategoryCardConfig[];
}

const initialConfig: CategoriesPageConfig = {
  showTitle: true,
  headerTitle: 'CATEGORIES.TITLE',
  headerSubtitle: 'STOREFRONT.AUTO_STR_39',
  categories: [
    { id: 'men', title: 'CATEGORIES.SHAPERS', accent: 'CATEGORIES.MENS', description: 'CATEGORIES.MENS_DESC', path: '/all-shapers?type=men' },
    { id: 'women', title: 'CATEGORIES.SHAPERS', accent: 'CATEGORIES.WOMENS', description: 'CATEGORIES.WOMENS_DESC', path: '/all-shapers?type=women' },
    { id: 'postpartum', title: 'CATEGORIES.POST', accent: 'CATEGORIES.MATERNITY', description: 'CATEGORIES.MATERNITY_DESC', path: '/all-shapers?type=postpartum' },
    { id: 'sport', title: 'CATEGORIES.SHAPERS', accent: 'CATEGORIES.SPORTS', description: 'CATEGORIES.SPORTS_DESC', path: '/all-shapers?type=sport' },
    { id: 'full-body', title: 'CATEGORIES.FULL_BODY', accent: 'CATEGORIES.BODY', description: 'CATEGORIES.FULL_BODY_DESC', path: '/all-shapers?type=full-body' },
    { id: 'waist', title: 'CATEGORIES.SHAPERS', accent: 'CATEGORIES.WAIST', description: 'CATEGORIES.WAIST_DESC', path: '/all-shapers?type=waist' }
  ]
};

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink, StoreLayoutComponent, HomeHeaderComponent, LucideAngularModule],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css'
})
export class CategoriesPageComponent {
  pageConfig = signal(initialConfig);

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
