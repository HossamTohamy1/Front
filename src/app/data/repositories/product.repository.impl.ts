import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProductRepository } from '../../domain/interfaces/product.repository';
import { Product, Category, Review } from '../../domain/models/product.model';
import { products, categories, reviews } from '../../shared/data/mockData';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductRepositoryImpl implements IProductRepository {
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    if (!environment.useMockData) {
      return this.http.get<Product[]>(`${environment.apiBaseUrl}/products`);
    }
    return of(products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    if (!environment.useMockData) {
      return this.http.get<Product>(`${environment.apiBaseUrl}/products/${id}`);
    }
    return of(products.find(p => p.id === id));
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    if (!environment.useMockData) {
      return this.http.get<Product>(`${environment.apiBaseUrl}/products/slug/${slug}`);
    }
    return of(products.find(p => p.slug === slug));
  }

  getCategories(): Observable<Category[]> {
    if (!environment.useMockData) {
      return this.http.get<Category[]>(`${environment.apiBaseUrl}/categories`);
    }
    return of(categories);
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    if (!environment.useMockData) {
      return this.http.get<Category>(`${environment.apiBaseUrl}/categories/slug/${slug}`);
    }
    return of(categories.find(c => c.slug === slug));
  }

  getReviews(productId?: string): Observable<Review[]> {
    if (!environment.useMockData) {
      const url = productId ? `${environment.apiBaseUrl}/reviews?productId=${productId}` : `${environment.apiBaseUrl}/reviews`;
      return this.http.get<Review[]>(url);
    }
    if (productId) {
      return of(reviews.filter(r => r.productId === productId));
    }
    return of(reviews);
  }
}
