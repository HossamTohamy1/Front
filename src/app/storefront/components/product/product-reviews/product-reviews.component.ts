import { Component, Input, OnInit, OnChanges, SimpleChanges, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateDirective, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Star, Edit as EditIcon, ChevronLeft, X as XIcon, CheckCircle } from 'lucide-angular';
import { ReviewService, SubmitReviewDto, CreateReviewDto, ReviewResponse } from '../../../../data/services/review.service';
import { ProductRepositoryImpl } from '../../../../data/repositories/product.repository.impl';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ChatService } from '../../../../data/services/chat.service';
import { getOrCreateUserTag } from '../../../../core/utils/user-tag.util';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, TranslateDirective, LucideAngularModule],
  template: `
    <section id="lk-reviews" class="lk-product-reviews-section">
      <div class="lk-reviews-header">
        <h2>{{ 'STOREFRONT.AUTO_STR_258' | translate }}</h2>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="lk-reviews-loading">
        <div class="lk-spinner"></div>
        <p>{{ langService.currentLang() === 'ar' ? 'جاري تحميل التقييمات...' : 'Loading reviews...' }}</p>
      </div>

      <!-- Content State -->
      <div *ngIf="!loading()" class="lk-product-reviews-layout">
        
        <!-- Rating Summary -->
        <div class="lk-rating-summary-panel">
          <div class="lk-rating-score">
            <strong>{{ avgRating().toFixed(1) }}</strong>
            <div class="lk-product-stars" [attr.aria-label]="avgRating().toFixed(1) + ' / 5'">
              <svg *ngFor="let s of [1, 2, 3, 4, 5]" 
                   viewBox="0 0 20 20" 
                   class="lk-solid-star summary" 
                   [class.is-filled]="s <= Math.round(avgRating())" 
                   aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span>{{ 'STOREFRONT.AUTO_STR_470' | translate }}</span>
            <small>({{ reviews().length }} {{ 'PRODUCT.REVIEWS' | translate }})</small>
          </div>

          <div class="lk-rating-bars">
            <div *ngFor="let row of ratingRows()">
              <span class="lk-rating-bar-label">{{row.value}} ★</span>
              <div class="lk-rating-bar-track">
                <div class="lk-rating-bar-fill" [style.width.%]="row.width"></div>
              </div>
              <small class="lk-rating-bar-count">({{row.count}})</small>
            </div>
          </div>
          
          <button type="button" class="lk-write-review-btn" (click)="openReviewModal()">
              <lucide-icon [img]="EditIcon" [size]="16" aria-hidden="true"></lucide-icon>
              <span>{{ (langService.currentLang() === 'ar' ? 'كتابة تقييم' : 'Write a Review') }}</span>
          </button>
        </div>

        <!-- Review Cards -->
        <div class="lk-review-cards">
          <!-- Empty State -->
          <div *ngIf="reviews().length === 0" class="lk-empty-reviews">
            <svg viewBox="0 0 20 20" width="48" height="48" class="lk-empty-star-icon" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <h3>{{ langService.currentLang() === 'ar' ? 'لا توجد تقييمات لهذا المنتج حتى الآن' : 'No reviews for this product yet' }}</h3>
            <p>{{ langService.currentLang() === 'ar' ? 'كن أول من يقيّم المنتج وشاركنا رأيك!' : 'Be the first to review this product and share your thoughts!' }}</p>
          </div>
          
          <!-- Review List -->
          <article *ngFor="let review of reviews()" class="lk-review-card" [class.is-pending]="review.isPending">
            <div class="lk-review-card-header">
              <div class="lk-review-author">
                <strong>
                  {{ review.user?.name || review.guestName || (langService.currentLang() === 'ar' ? 'عميل المتجر' : 'Store Customer') }}
                  <span *ngIf="review.isPending" class="lk-pending-badge">{{ langService.currentLang() === 'ar' ? '(قيد المراجعة)' : '(Pending)' }}</span>
                </strong>
                <small>{{ review.createdAt | date:'longDate' }}</small>
              </div>
              <div class="lk-product-stars">
                <svg *ngFor="let s of [1, 2, 3, 4, 5]" 
                     viewBox="0 0 20 20" 
                     class="lk-solid-star card" 
                     [class.is-filled]="s <= review.rating" 
                     aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>
            <p class="lk-review-comment">{{ review.comment }}</p>
            <div *ngIf="review.supportContacted" class="lk-support-contacted-badge">
              <lucide-icon [img]="CheckCircle" [size]="14"></lucide-icon>
              <span>{{ langService.currentLang() === 'ar' ? 'تم التواصل معك من متجر LOXXKING' : 'Contacted by LOXXKING Support' }}</span>
            </div>
          </article>
        </div>
      </div>
      
      <!-- Review Modal -->
      <div *ngIf="showReviewModal()" class="lk-review-modal-backdrop" (click)="toggleReviewModal(false)">
          <div class="lk-review-modal-card" (click)="$event.stopPropagation()">
              <div class="lk-review-modal-header">
                  <h3>{{ (langService.currentLang() === 'ar' ? 'أضف تقييمك للمنتج' : 'Write a Product Review') }}</h3>
                  <button type="button" class="lk-modal-close-btn" (click)="toggleReviewModal(false)" [disabled]="isSubmitting()">
                      <lucide-icon [img]="XIcon" [size]="20" aria-hidden="true"></lucide-icon>
                  </button>
              </div>
              
              <form (submit)="submitReview($event)" class="lk-review-form">
                  <!-- Guest Name Field (Conditional) -->
                  <div *ngIf="!isAuthenticated()" class="lk-form-group">
                      <label>{{ langService.currentLang() === 'ar' ? 'الاسم (اختياري)' : 'Name (Optional)' }}</label>
                      <input type="text" [placeholder]="langService.currentLang() === 'ar' ? 'أدخل اسمك (أو سيظهر كـ ' + defaultUserTag() + ')' : 'Enter your name (or ' + defaultUserTag() + ')'" 
                             [ngModel]="guestName()" (ngModelChange)="guestName.set($event)" name="guestName" [disabled]="isSubmitting()" class="lk-input-field" />
                  </div>

                  <!-- Rating Picker -->
                  <div class="lk-form-group">
                      <label>{{ (langService.currentLang() === 'ar' ? 'تقييمك للمنتج' : 'Your Rating') }} <span class="lk-required">*</span></label>
                      <div class="lk-star-picker-wrapper">
                        <div class="lk-star-picker">
                            <button type="button" *ngFor="let s of [1,2,3,4,5]" 
                                    (click)="newReviewRating.set(s)" 
                                    (mouseenter)="hoverRating.set(s)"
                                    (mouseleave)="hoverRating.set(0)"
                                    class="lk-star-btn" 
                                    [attr.aria-label]="s + ' stars'"
                                    [disabled]="isSubmitting()">
                                <svg viewBox="0 0 20 20" 
                                     class="lk-solid-star picker" 
                                     [class.is-filled]="s <= (hoverRating() || newReviewRating())" 
                                     aria-hidden="true">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                            </button>
                        </div>
                        <span class="lk-rating-badge-label">{{ getRatingHint() }}</span>
                      </div>
                  </div>

                  <!-- Comment Field -->
                  <div class="lk-form-group">
                      <label>{{ (langService.currentLang() === 'ar' ? 'تعليقك' : 'Your Review') }} <span class="lk-required">*</span></label>
                      <textarea rows="4" [placeholder]="langService.currentLang() === 'ar' ? 'شاركنا تجربتك ورأيك بالمنتج...' : 'Share your experience with this product...'" 
                                [ngModel]="newReviewComment()" (ngModelChange)="newReviewComment.set($event)" 
                                name="comment" required [disabled]="isSubmitting()" class="lk-textarea-field" maxlength="500"></textarea>
                      <div class="lk-char-counter">{{ newReviewComment().length }} / 500</div>
                  </div>

                  <!-- Error Message -->
                  <div *ngIf="errorMessage()" class="lk-error-message">
                      {{ errorMessage() }}
                  </div>
                  
                  <!-- Actions -->
                  <div class="lk-modal-actions">
                      <button type="button" class="lk-cancel-btn" (click)="toggleReviewModal(false)" [disabled]="isSubmitting()">
                          {{ langService.currentLang() === 'ar' ? 'إلغاء' : 'Cancel' }}
                      </button>
                      <button type="submit" class="lk-submit-review-btn" [disabled]="isSubmitting() || !isFormValid()">
                          {{ isSubmitting() ? (langService.currentLang() === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (langService.currentLang() === 'ar' ? 'إرسال التقييم' : 'Submit Review') }}
                      </button>
                  </div>
              </form>
          </div>
      </div>
    </section>
  `,
  styles: [`
    .lk-product-reviews-section {
        padding: 60px 0;
        border-top: 1px solid #eaeaea;
        font-family: inherit;
    }
    .lk-reviews-header {
        margin-bottom: 30px;
    }
    .lk-reviews-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a1a1a;
        margin: 0;
    }
    .lk-reviews-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 0;
        color: #666;
    }
    .lk-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #111;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    
    .lk-product-reviews-layout {
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: 50px;
        align-items: start;
    }
    .lk-rating-summary-panel {
        background: #fafafa;
        border-radius: 12px;
        padding: 30px;
        position: sticky;
        top: 20px;
    }
    .lk-rating-score {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        margin-bottom: 30px;
    }
    .lk-rating-score strong {
        font-size: 4.5rem;
        line-height: 1;
        font-weight: 800;
        color: #111;
    }
    .lk-product-stars {
        display: flex;
        align-items: center;
        gap: 3px;
        direction: ltr;
    }
    .lk-solid-star {
        display: inline-block;
        fill: #e2e8f0;
        transition: fill 0.15s ease, transform 0.15s ease;
        flex-shrink: 0;
    }
    .lk-solid-star.summary {
        width: 22px;
        height: 22px;
    }
    .lk-solid-star.card {
        width: 17px;
        height: 17px;
    }
    .lk-solid-star.picker {
        width: 34px;
        height: 34px;
    }
    .lk-solid-star.is-filled {
        fill: #f59e0b;
    }
    .lk-empty-star-icon {
        fill: #cbd5e1;
    }
    .lk-rating-score span {
        font-weight: 600;
        font-size: 1.1rem;
        color: #333;
    }
    .lk-rating-score small {
        color: #777;
        font-size: 0.9rem;
    }
    .lk-rating-bars {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 30px;
    }
    .lk-rating-bars > div {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.95rem;
    }
    .lk-rating-bar-label {
        font-weight: 600;
        color: #555;
        width: 32px;
        white-space: nowrap;
    }
    .lk-rating-bar-track {
        flex: 1;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
    }
    .lk-rating-bar-fill {
        height: 100%;
        background: #f59e0b;
        border-radius: 4px;
        transition: width 0.3s ease;
    }
    .lk-rating-bar-count {
        width: 30px;
        text-align: right;
        color: #888;
    }
    .lk-write-review-btn {
        width: 100%;
        background: #111;
        color: #fff;
        padding: 14px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: background 0.2s;
    }
    .lk-write-review-btn:hover {
        background: #333;
    }
    
    .lk-review-cards {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
    .lk-empty-reviews {
        background: #fafafa;
        border-radius: 12px;
        padding: 60px 30px;
        text-align: center;
        color: #666;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }
    .lk-empty-reviews h3 {
        margin: 0;
        color: #111;
        font-size: 1.25rem;
    }
    .lk-empty-reviews p {
        margin: 0;
    }
    
    .lk-review-card {
        background: #fff;
        padding: 24px;
        border: 1px solid #eaeaea;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .lk-review-card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .lk-review-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
    }
    .lk-review-author {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .lk-review-author strong {
        font-size: 1.1rem;
        color: #111;
    }
    .lk-review-author small {
        color: #888;
        font-size: 0.85rem;
    }
    .lk-review-comment {
        margin: 0;
        color: #444;
        line-height: 1.6;
        font-size: 1rem;
    }
    .lk-support-contacted-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 15px;
        background: #f0f9ff;
        color: #026fc2;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 600;
        border: 1px solid #bae6fd;
    }
    .lk-pending-badge {
        color: #e65100;
        font-size: 0.85rem;
        font-weight: normal;
        margin: 0 5px;
    }
    .lk-review-card.is-pending {
        opacity: 0.8;
        border-style: dashed;
    }
    
    /* Modal Styles */
    .lk-review-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
    }
    .lk-review-modal-card {
        background: #fff;
        width: 100%;
        max-width: 550px;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        max-height: 90vh;
        overflow-y: auto;
    }
    .lk-review-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eaeaea;
    }
    .lk-review-modal-header h3 {
        margin: 0;
        font-size: 1.3rem;
        color: #111;
    }
    .lk-modal-close-btn {
        background: #f5f5f5;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #555;
        transition: background 0.2s;
    }
    .lk-modal-close-btn:hover {
        background: #e0e0e0;
    }
    
    .lk-form-group {
        margin-bottom: 20px;
    }
    .lk-form-group label {
        display: block;
        margin-bottom: 10px;
        font-weight: 600;
        color: #333;
    }
    .lk-required {
        color: #d32f2f;
    }
    .lk-input-field, .lk-textarea-field {
        width: 100%;
        padding: 14px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-family: inherit;
        font-size: 1rem;
        background: #fafafa;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
    }
    .lk-textarea-field {
        resize: vertical;
        min-height: 100px;
    }
    .lk-input-field:focus, .lk-textarea-field:focus {
        outline: none;
        border-color: #111;
        box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
        background: #fff;
    }
    .lk-char-counter {
        text-align: left;
        font-size: 0.8rem;
        color: #888;
        margin-top: 5px;
    }
    
    .lk-star-picker-wrapper {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
    }
    .lk-star-picker {
        display: flex;
        align-items: center;
        gap: 6px;
        direction: ltr;
    }
    .lk-star-btn {
        background: transparent;
        border: none;
        padding: 4px;
        cursor: pointer;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        border-radius: 6px;
    }
    .lk-star-btn:hover:not(:disabled) {
        transform: scale(1.18);
    }
    .lk-star-btn:active:not(:disabled) {
        transform: scale(0.95);
    }
    .lk-rating-badge-label {
        font-size: 0.9rem;
        font-weight: 700;
        color: #b45309;
        background: #fef3c7;
        padding: 4px 12px;
        border-radius: 9999px;
    }
    
    .lk-error-message {
        color: #d32f2f;
        background: #ffebee;
        padding: 12px 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 0.95rem;
        border: 1px solid #ffcdd2;
    }
    
    .lk-modal-actions {
        display: flex;
        gap: 15px;
        margin-top: 30px;
    }
    .lk-cancel-btn, .lk-submit-review-btn {
        padding: 14px 20px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
        flex: 1;
    }
    .lk-cancel-btn {
        background: #f5f5f5;
        border: 1px solid #ddd;
        color: #555;
    }
    .lk-cancel-btn:hover:not(:disabled) {
        background: #e0e0e0;
    }
    .lk-submit-review-btn {
        background: #111;
        border: 1px solid #111;
        color: #fff;
    }
    .lk-submit-review-btn:hover:not(:disabled) {
        background: #333;
    }
    .lk-submit-review-btn:disabled, .lk-cancel-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    @media (max-width: 900px) {
        .lk-product-reviews-layout {
            grid-template-columns: 1fr;
            gap: 30px;
        }
        .lk-rating-summary-panel {
            position: static;
        }
    }
    
    html[dir="ltr"] .lk-char-counter {
        text-align: right;
    }
  `]
})
export class ProductReviewsComponent implements OnInit, OnChanges {
  @Input() productId!: string;
  
  readonly langService = inject(TranslateService);
  private reviewService = inject(ReviewService);
  private productRepo = inject(ProductRepositoryImpl);
  readonly authService = inject(AuthService);
  private chatService = inject(ChatService);

  Star = Star;
  EditIcon = EditIcon;
  ChevronLeft = ChevronLeft;
  XIcon = XIcon;
  CheckCircle = CheckCircle;
  Math = Math;

  reviews = signal<ReviewResponse[]>([]);
  loading = signal(true);
  
  showReviewModal = signal(false);
  newReviewRating = signal(5);
  hoverRating = signal(0);
  newReviewComment = signal('');
  guestName = signal('');
  defaultUserTag = computed(() => getOrCreateUserTag());
  isSubmitting = signal(false);
  errorMessage = signal('');
  
  avgRating = computed(() => {
    const list = this.reviews();
    if (!list || list.length === 0) return 0;
    const sum = list.reduce((a, b) => a + b.rating, 0);
    return sum / list.length;
  });

  ratingRows = computed(() => {
    const list = this.reviews() || [];
    const rows = [5, 4, 3, 2, 1].map(val => ({ value: val, count: 0, width: 0 }));
    list.forEach(r => {
      const row = rows.find(row => row.value === r.rating);
      if (row) row.count++;
    });
    if (list.length > 0) {
      rows.forEach(r => r.width = (r.count / list.length) * 100);
    }
    return rows;
  });

  ngOnInit() {
    this.loadReviews();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && !changes['productId'].isFirstChange()) {
      this.loadReviews();
    }
  }

  loadReviews() {
    this.loading.set(true);
    const realGuid = this.productRepo.getRealProductId(this.productId);

    this.reviewService.getReviews(realGuid).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.reviews.set(data);
        } else {
          this.reviews.set([]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.reviews.set([]);
        this.loading.set(false);
      }
    });
  }

  getFiveStars() {
    return Array(5).fill(0);
  }

  getStars(count: number) {
    return Array(Math.min(Math.max(count, 0), 5)).fill(0);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleReviewModal(show: boolean) {
    if (this.isSubmitting()) return;
    this.showReviewModal.set(show);
    if (!show) {
      this.errorMessage.set('');
    }
  }

  getRatingHint(): string {
    const r = this.hoverRating() || this.newReviewRating();
    const isAr = this.langService.currentLang() === 'ar';
    switch (r) {
      case 5: return isAr ? 'ممتاز (5/5)' : 'Excellent (5/5)';
      case 4: return isAr ? 'جيد جداً (4/5)' : 'Very Good (4/5)';
      case 3: return isAr ? 'جيد (3/5)' : 'Good (3/5)';
      case 2: return isAr ? 'مقبول (2/5)' : 'Fair (2/5)';
      case 1: return isAr ? 'سيء (1/5)' : 'Poor (1/5)';
      default: return '';
    }
  }

  openReviewModal() {
    this.newReviewRating.set(5);
    this.hoverRating.set(0);
    this.newReviewComment.set('');
    this.guestName.set('');
    this.errorMessage.set('');
    this.toggleReviewModal(true);
  }

  isFormValid(): boolean {
    const commentValid = this.newReviewComment().trim().length > 0 && this.newReviewComment().trim().length <= 500;
    const ratingValid = this.newReviewRating() >= 1 && this.newReviewRating() <= 5;
    return commentValid && ratingValid;
  }

  submitReview(e: Event) {
    e.preventDefault();
    if (!this.isFormValid()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const realGuid = this.productRepo.getRealProductId(this.productId);

    if (this.isAuthenticated()) {
      const dto: SubmitReviewDto = {
        rating: this.newReviewRating(),
        comment: this.newReviewComment().trim()
      };
      this.reviewService.submitReview(realGuid, dto).subscribe({
        next: () => {
          this.loadReviews();
          this.chatService.triggerRefresh();
          this.isSubmitting.set(false);
          this.toggleReviewModal(false);
        },
        error: (err) => {
          this.handleOptimisticAdd(this.newReviewRating(), this.newReviewComment().trim(), null, this.authService.user()?.name || 'عميل المتجر');
          this.isSubmitting.set(false);
          this.toggleReviewModal(false);
        }
      });
    } else {
      const finalGuestName = this.guestName().trim() || getOrCreateUserTag();
      const dto: CreateReviewDto = {
        rating: this.newReviewRating(),
        comment: this.newReviewComment().trim(),
        guestName: finalGuestName
      };
      this.reviewService.createReview(realGuid, dto).subscribe({
        next: () => {
          this.loadReviews();
          this.chatService.triggerRefresh();
          this.isSubmitting.set(false);
          this.toggleReviewModal(false);
        },
        error: (err) => {
          this.handleOptimisticAdd(this.newReviewRating(), this.newReviewComment().trim(), finalGuestName, null);
          this.isSubmitting.set(false);
          this.toggleReviewModal(false);
        }
      });
    }
  }

  private handleOptimisticAdd(rating: number, comment: string, guestName: string | null, userName: string | null) {
    const optimisticReview: ReviewResponse = {
      id: 'temp-' + Date.now().toString(),
      rating,
      comment,
      createdAt: new Date().toISOString(),
      guestName,
      user: userName ? { id: 'temp-user', name: userName } : null,
      supportContacted: true,
      isPending: false
    };

    // Prepend to local UI without wiping out existing reviews via loadReviews
    this.reviews.update(list => [optimisticReview, ...list]);
    this.chatService.triggerRefresh();
  }

  private handleError(err: any) {
    this.isSubmitting.set(false);
    // Only show API errors. Don't show toast on 200 OK.
    if (err && err.status !== 200) {
      this.errorMessage.set(err?.error?.error?.message || (this.langService.currentLang() === 'ar' ? 'حدث خطأ أثناء إرسال التقييم. يرجى المحاولة لاحقاً.' : 'An error occurred while submitting the review. Please try again.'));
    }
  }
}
