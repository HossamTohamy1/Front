import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  error: any;
}

export interface ReviewResponse {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  guestName?: string | null;
  user?: {
    id: string;
    name: string;
  } | null;
  supportContacted: boolean;
  isPending?: boolean; // Used for optimistic UI
}

export interface SubmitReviewDto {
  rating: number;
  comment: string;
}

export interface CreateReviewDto {
  rating: number;
  comment: string;
  guestName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getReviews(productId: string): Observable<ReviewResponse[]> {
    return this.http.get<ApiResponse<ReviewResponse[]>>(`${this.baseUrl}/reviews/product/${productId}`)
      .pipe(map(res => Array.isArray(res?.data) ? res.data : []));
  }

  // Used by guests
  createReview(productId: string, dto: CreateReviewDto): Observable<any> {
    const guestId = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('lk-guest-id') : null;
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/reviews`, { ...dto, productId, guestId })
      .pipe(map(res => res?.data || null));
  }

  // Used by authenticated users to trigger Support Chatbot
  submitReview(productId: string, dto: SubmitReviewDto): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/products/${productId}/reviews`, dto)
      .pipe(map(res => res?.data || null));
  }
}
