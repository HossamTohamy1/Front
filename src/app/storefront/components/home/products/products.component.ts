import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ShoppingCart, Star } from 'lucide-angular';
import { homeProducts } from '../../../../shared/data/homePageData';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  @Input() config?: any;
  readonly ShoppingCart = ShoppingCart;
  readonly Star = Star;

  get title() {
    return this.config?.title ?? 'HOME.BEST_SELLERS_ALT';
  }

  get displayProducts() {
    return this.config?.products?.length ? this.config.products : homeProducts;
  }

  getMappedProduct(product: any) {
    if ('productId' in product) return product;
    return {
      id: product.id,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      oldPrice: product.originalPrice || product.price,
      rating: product.rating,
      reviews: product.reviewsCount,
      discount: product.discount ? parseInt(product.discount) : undefined
    };
  }

  handleAddToCart(event: Event, item: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Added to cart', item);
  }
}
