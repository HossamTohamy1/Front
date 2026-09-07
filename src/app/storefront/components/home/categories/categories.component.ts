import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  @Input() config?: any;

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
  }
  
  getCategoryPath(category: any): string {
    return category.path ? category.path : '/categories';
  }
  
  getCategoryLabel(category: any): string {
    return category.label ? category.label : category.name;
  }
}
