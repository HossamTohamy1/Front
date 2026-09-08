import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';
import { LucideAngularModule, ChevronLeft, ArrowRight } from 'lucide-angular';

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
    { id: 'men', title: 'CATEGORIES.SHAPERS', accent: 'CATEGORIES.MENS', description: 'دعم مثالي وثقة\nطوال اليوم', path: '/all-shapers?type=men' },
    { id: 'women', title: 'CATEGORIES.SHAPERS', accent: 'CATEGORIES.WOMENS', description: 'تصاميم أنثوية\nلإطلالة مثالية', path: '/all-shapers?type=women' },
    { id: 'postpartum', title: 'CATEGORIES.POST', accent: 'CATEGORIES.MATERNITY', description: 'راحة ودعم بعد\nفترة الحمل', path: '/all-shapers?type=postpartum' },
    { id: 'sport', title: 'CATEGORIES.SHAPERS', accent: 'CATEGORIES.SPORTS', description: 'حرية الحركة\nوأداء أفضل', path: '/all-shapers?type=sport' },
    { id: 'full-body', title: 'CATEGORIES.FULL_BODY', accent: 'CATEGORIES.BODY', description: 'تنسيق شامل\nلجسم مثالي', path: '/all-shapers?type=full-body' },
    { id: 'waist', title: 'CATEGORIES.SHAPERS', accent: 'CATEGORIES.WAIST', description: 'خصر أنحف\nوإطلالة جذابة', path: '/all-shapers?type=waist' }
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
    return (desc || '').split('\n');
  }
}
