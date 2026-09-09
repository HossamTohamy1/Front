import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductRepositoryImpl } from '../../../../data/repositories/product.repository.impl';
import { LangService } from '../../../../core/services/lang/lang.service';

import { LocalizeFieldPipe } from '../../../../shared/pipes/localize-field.pipe';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink, LocalizeFieldPipe],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent {
  @Input() config?: any;
  private productRepo = inject(ProductRepositoryImpl);
  readonly langService = inject(LangService);

  liveCategories = signal<any[]>([]);

  homeCategories = [
    { id: '1', name: 'STOREFRONT.AUTO_STR_241', label: 'STOREFRONT.AUTO_STR_241', image: '/assets/home/category-full.png', path: '/categories/full' },
    { id: '2', name: 'COMMON.WAISTTRAINERS', label: 'COMMON.WAISTTRAINERS', image: '/assets/home/category-waist.png', path: '/categories/waist' },
    { id: '3', name: 'STOREFRONT.AUTO_STR_348', label: 'STOREFRONT.AUTO_STR_348', image: '/assets/home/category-chest.png', path: '/categories/chest' }
  ];

  constructor() {
    this.productRepo.getCategories().subscribe(cats => {
      if (cats && cats.length > 0) {
        this.liveCategories.set(cats.map(c => ({
          id: c.id,
          name: this.langService.storefrontLang() === 'ar' ? (c.nameAr || c.nameEn) : (c.nameEn || c.nameAr),
          label: this.langService.storefrontLang() === 'ar' ? (c.nameAr || c.nameEn) : (c.nameEn || c.nameAr),
          image: c.image || '/assets/home/category-full.png',
          path: `/categories/${c.slug || c.id}`
        })));
      }
    });
  }

  get title(): string {
    return this.config?.title ?? 'HOME.SHOP_BY_CATEGORY_ALT';
  }

  get titleAr(): string {
    return this.config?.titleAr ?? '';
  }

  get titleEn(): string {
    return this.config?.titleEn ?? '';
  }

  get displayCategories(): any[] {
    if (this.config?.categories && this.config.categories.length > 0) {
      return this.config.categories;
    }
    if (this.liveCategories().length > 0) {
      return this.liveCategories();
    }
    return this.homeCategories;
  }
  
  getCategoryPath(category: any): string {
    return category.path ? category.path : (category.id ? `/categories/${category.id}` : '/categories');
  }
  
  getCategoryLabel(category: any): string {
    const isAr = this.langService.storefrontLang() === 'ar';
    return isAr 
      ? (category.nameAr || category.nameEn || category.name || category.label || '') 
      : (category.nameEn || category.nameAr || category.name || category.label || '');
  }
}

