import { Injectable, signal } from '@angular/core';
import { ManagedCategory, ManagedProduct, ManagedOffer } from '../../models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private categoriesSignal = signal<ManagedCategory[]>([]);
  private productsSignal = signal<ManagedProduct[]>([]);
  private offersSignal = signal<ManagedOffer[]>([]);

  readonly categories = this.categoriesSignal.asReadonly();
  readonly products = this.productsSignal.asReadonly();
  readonly offers = this.offersSignal.asReadonly();

  constructor() {
    this.categoriesSignal.set([{ id: 'cat-1', name: 'CATALOG.MENS_CLOTHING', count: 0 }]);
  }

  saveProduct(product: ManagedProduct) {
    this.productsSignal.update(p => {
      const exists = p.some(x => x.id === product.id);
      if (exists) return p.map(x => x.id === product.id ? product : x);
      return [product, ...p];
    });
  }

  deleteProduct(id: string) {
    this.productsSignal.update(p => p.filter(x => x.id !== id));
  }

  saveCategory(cat: ManagedCategory) {
    this.categoriesSignal.update(c => {
      const exists = c.some(x => x.id === cat.id);
      if (exists) return c.map(x => x.id === cat.id ? cat : x);
      return [cat, ...c];
    });
  }

  deleteCategory(id: string) {
    this.categoriesSignal.update(c => c.filter(x => x.id !== id));
  }
}
