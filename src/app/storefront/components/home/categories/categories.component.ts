import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductRepositoryImpl } from '../../../../data/repositories/product.repository.impl';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  @Input() config?: any;
  private productRepo = inject(ProductRepositoryImpl);

  title = 'HOME.SHOP_BY_CATEGORY_ALT';
  displayCategories: any[] = [];

  homeCategories = [
    { id: '1', name: 'STOREFRONT.AUTO_STR_241', label: 'STOREFRONT.AUTO_STR_241', image: '/assets/home/category-full.png', path: '/categories/full' },
    { id: '2', name: 'COMMON.WAISTTRAINERS', label: 'COMMON.WAISTTRAINERS', image: '/assets/home/category-waist.png', path: '/categories/waist' },
    { id: '3', name: 'STOREFRONT.AUTO_STR_348', label: 'STOREFRONT.AUTO_STR_348', image: '/assets/home/category-chest.png', path: '/categories/chest' }
  ];

  ngOnInit() {
    this.title = this.config?.title ?? 'HOME.SHOP_BY_CATEGORY_ALT';
    this.displayCategories = this.config?.categories?.length ? this.config.categories : this.homeCategories;
    this.productRepo.getCategories().subscribe(cats => {
      if (cats && cats.length > 0) {
        this.displayCategories = cats.map(c => ({
          id: c.id,
          name: c.nameAr || c.nameEn,
          label: c.nameAr || c.nameEn,
          image: c.image || '/assets/home/category-full.png',
          path: `/categories/${c.slug || c.id}`
        }));
      }
    });
  }
  
  getCategoryPath(category: any): string {
    return category.path ? category.path : '/categories';
  }
  
  getCategoryLabel(category: any): string {
    return category.label ? category.label : category.name;
  }
}
