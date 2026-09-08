import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ShoppingCart, Star } from 'lucide-angular';
import { homeProducts } from '../../../../shared/data/homePageData';
import { ProductRepositoryImpl } from '../../../../data/repositories/product.repository.impl';
import { products as mockProducts } from '../../../../shared/data/mockData';
import { LangService } from '../../../../core/services/lang/lang.service';
import { CartService } from '../../../../core/services/cart/cart.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

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

  private productRepo = inject(ProductRepositoryImpl);
  readonly langService = inject(LangService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  liveProducts = signal<any[]>([]);

  constructor() {
    this.productRepo.getProducts().subscribe(prods => {
      if (prods && prods.length > 0) {
        this.liveProducts.set(prods);
      }
    });
  }

  get title() {
    return this.config?.title ?? 'HOME.BEST_SELLERS_ALT';
  }

  get displayProducts() {
    if (this.config?.products?.length) return this.config.products;
    if (this.liveProducts().length > 0) return this.liveProducts();
    return homeProducts;
  }

  getMappedProduct(product: any) {
    if ('productId' in product) return product;
    const isAr = this.langService.storefrontLang() === 'ar';
    return {
      id: product.id,
      productId: product.id,
      name: isAr ? (product.nameAr || product.nameEn || product.name) : (product.nameEn || product.nameAr || product.name),
      image: (product.images && product.images[0]) || product.image || '/assets/home/product-1.png',
      price: product.price,
      oldPrice: product.originalPrice || product.price,
      rating: product.rating ?? 5,
      reviews: product.reviewCount ?? product.reviewsCount ?? 0,
      discount: product.discount ? parseInt(product.discount) : undefined
    };
  }

  handleAddToCart(event: Event, item: any) {
    event.preventDefault();
    event.stopPropagation();
    const mapped = this.getMappedProduct(item);
    const product = mockProducts.find((p: any) => p.id === mapped.productId || p.id === mapped.id) || {
      id: mapped.productId || mapped.id,
      name: mapped.name,
      nameAr: item.nameAr || mapped.name,
      nameEn: item.nameEn || mapped.name,
      price: mapped.price,
      image: mapped.image,
      images: [mapped.image],
      stock: 10,
      rating: mapped.rating || 5,
      reviewCount: mapped.reviews || 10,
      sizes: ['M', 'L', 'XL'],
      colors: ['Black']
    };
    this.cartService.addToCart(product as any, 'M', 1);
    this.toastService.success('STOREFRONT.AUTO_STR_114');
  }
}
