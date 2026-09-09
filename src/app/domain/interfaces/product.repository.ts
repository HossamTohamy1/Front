import { Observable } from 'rxjs';
import { Product, Category, Review } from '../models/product.model';

export interface IProductRepository {
  getProducts(): Observable<Product[]>;
  getProductById(id: string): Observable<Product | undefined>;
  getProductBySlug(slug: string): Observable<Product | undefined>;
  getCategories(): Observable<Category[]>;
  getCategoryBySlug(slug: string): Observable<Category | undefined>;
  getReviews(productId?: string): Observable<Review[]>;
  getRealProductId(mockId: string): string;
}
