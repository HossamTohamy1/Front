import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../../shared/data/mockData';

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = signal<CartItem[]>([]);

  cartCount = computed(() => this.cart().reduce((sum, item) => sum + item.quantity, 0));
  cartTotal = computed(() => this.cart().reduce((sum, item) => sum + (item.product.price * item.quantity), 0));

  addToCart(product: Product, size: string, quantity = 1) {
    this.cart.update(current => {
      const existing = current.find(item => item.product.id === product.id && item.size === size);
      if (existing) {
        return current.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { product, size, quantity }];
    });
  }

  removeFromCart(productId: string, size: string) {
    this.cart.update(current => current.filter(item => !(item.product.id === productId && item.size === size)));
  }

  updateQuantity(productId: string, size: string, quantity: number) {
    this.cart.update(current => {
      if (quantity <= 0) {
        return current.filter(item => !(item.product.id === productId && item.size === size));
      }
      return current.map(item =>
        item.product.id === productId && item.size === size ? { ...item, quantity } : item
      );
    });
  }

  clearCart() {
    this.cart.set([]);
  }
}
