import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IProductRepository } from '../../domain/interfaces/product.repository';
import { Product, Category, Review } from '../../domain/models/product.model';
import { products, categories, reviews } from '../../shared/data/mockData';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductRepositoryImpl implements IProductRepository {
  private http = inject(HttpClient);

  private mapProduct(p: any): Product {
    let sizeChart: any[] = [];
    if (p.sizeChart) {
      if (typeof p.sizeChart === 'string') {
        try {
          sizeChart = JSON.parse(p.sizeChart);
        } catch {}
      } else if (Array.isArray(p.sizeChart)) {
        sizeChart = p.sizeChart;
      }
    }

    return {
      id: p.id,
      slug: p.slug || p.id,
      nameEn: p.nameEn || p.name || '',
      nameAr: p.nameAr || p.name || '',
      descEn: p.descEn || p.description || '',
      descAr: p.descAr || p.description || '',
      price: p.price ?? p.basePrice ?? 0,
      originalPrice: p.originalPrice != null ? p.originalPrice : undefined,
      images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
      category: typeof p.category === 'string' ? p.category : (p.category?.nameEn || p.categoryName || ''),
      sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L', 'XL'],
      sizeChart,
      stock: p.stock ?? 10,
      rating: p.rating ?? 5,
      reviewCount: p.reviewCount ?? 0,
      isNew: p.isNew ?? false,
      isBestSeller: p.isBestSeller ?? false,
      badge: p.badge,
      colors: Array.isArray(p.colors) ? p.colors : [],
    };
  }

  private mapCategory(c: any): Category {
    return {
      id: c.id,
      slug: c.slug || c.id,
      nameEn: c.nameEn || c.name || '',
      nameAr: c.nameAr || c.name || '',
      image: c.image || c.imageUrl || '',
      productCount: c.productCount ?? 0,
    };
  }

  private mapReview(r: any): Review {
    return {
      id: r.id,
      productId: r.productId,
      userName: r.userName || r.userFullName || 'عميل المتجر',
      rating: r.rating ?? 5,
      comment: r.comment || '',
      date: r.createdAt || r.date || new Date().toISOString(),
      approved: r.approved ?? true,
    };
  }

  getProducts(): Observable<Product[]> {
    if (!environment.useMockData) {
      return this.http.get<any>(`${environment.apiBaseUrl}/products`).pipe(
        map(res => {
          const items = res?.data ?? res ?? [];
          if (!Array.isArray(items) || items.length === 0) return products;
          return items.map(p => this.mapProduct(p));
        }),
        catchError(() => of(products))
      );
    }
    return of(products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    if (!environment.useMockData) {
      return this.http.get<any>(`${environment.apiBaseUrl}/products/${id}`).pipe(
        map(res => {
          const p = res?.data ?? res;
          return p ? this.mapProduct(p) : products.find(prod => prod.id === id);
        }),
        catchError(() => of(products.find(p => p.id === id)))
      );
    }
    return of(products.find(p => p.id === id));
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    if (!environment.useMockData) {
      return this.http.get<any>(`${environment.apiBaseUrl}/products/slug/${slug}`).pipe(
        map(res => {
          const p = res?.data ?? res;
          return p ? this.mapProduct(p) : products.find(prod => prod.slug === slug);
        }),
        catchError(() => of(products.find(p => p.slug === slug)))
      );
    }
    return of(products.find(p => p.slug === slug));
  }

  getCategories(): Observable<Category[]> {
    if (!environment.useMockData) {
      return this.http.get<any>(`${environment.apiBaseUrl}/categories`).pipe(
        map(res => {
          const items = res?.data ?? res ?? [];
          if (!Array.isArray(items) || items.length === 0) return categories;
          return items.map(c => this.mapCategory(c));
        }),
        catchError(() => of(categories))
      );
    }
    return of(categories);
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    if (!environment.useMockData) {
      return this.http.get<any>(`${environment.apiBaseUrl}/categories/slug/${slug}`).pipe(
        map(res => {
          const c = res?.data ?? res;
          return c ? this.mapCategory(c) : categories.find(cat => cat.slug === slug);
        }),
        catchError(() => of(categories.find(c => c.slug === slug)))
      );
    }
    return of(categories.find(c => c.slug === slug));
  }

  getReviews(productId?: string): Observable<Review[]> {
    if (!environment.useMockData) {
      const url = productId ? `${environment.apiBaseUrl}/reviews?productId=${productId}` : `${environment.apiBaseUrl}/reviews`;
      return this.http.get<any>(url).pipe(
        map(res => {
          const items = res?.data ?? res ?? [];
          if (!Array.isArray(items)) return reviews;
          return items.map(r => this.mapReview(r));
        }),
        catchError(() => of(productId ? reviews.filter(r => r.productId === productId) : reviews))
      );
    }
    if (productId) {
      return of(reviews.filter(r => r.productId === productId));
    }
    return of(reviews);
  }
}
