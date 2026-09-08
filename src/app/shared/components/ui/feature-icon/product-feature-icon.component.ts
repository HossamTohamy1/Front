import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-feature-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg *ngIf="name === 'shield'" class="lk-product-feature-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 8 49 14v15c0 12-6.8 21.8-17 27-10.2-5.2-17-15-17-27V14L32 8Z" stroke="currentColor" stroke-width="2" />
      <path d="m24.5 31.5 5 5 10-11" stroke="currentColor" stroke-width="2" />
    </svg>
    <svg *ngIf="name === 'feather'" class="lk-product-feature-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M50.5 11.5C37 12.2 24.3 20.4 18.4 31.8c-2.7 5.2-3.4 10.2-2.2 15.2" stroke="currentColor" stroke-width="2" />
      <path d="M50.5 11.5c-.2 13.7-8.9 26.3-21 31.8-4.8 2.2-9.4 2.6-13.3 1.3" stroke="currentColor" stroke-width="2" />
      <path d="M15.8 46.2 9.5 52.5" stroke="currentColor" stroke-width="2" />
      <path d="M20.8 39.2c6.8-.8 13.3-3.5 19.3-8.1" stroke="currentColor" stroke-width="2" />
      <path d="M25 31.8c5.2-.8 10.4-3.1 15.4-6.8" stroke="currentColor" stroke-width="2" />
    </svg>
    <svg *ngIf="name === 'posture'" class="lk-product-feature-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M26 10c1.3 4.4 1 8.7-1 12.8-2.3 4.7-3.2 9.4-2.6 14.2.7 5.6 3.8 10.7 9.6 15" stroke="currentColor" stroke-width="2" />
      <path d="M38 10c-1.3 4.4-1 8.7 1 12.8 2.3 4.7 3.2 9.4 2.6 14.2-.7 5.6-3.8 10.7-9.6 15" stroke="currentColor" stroke-width="2" />
      <path d="M24.5 23.5c4.8 2.5 10.2 2.5 15 0" stroke="currentColor" stroke-width="2" />
      <path d="M23 38c5.6-2.5 12.4-2.5 18 0" stroke="currentColor" stroke-width="2" />
      <path d="M13 30h9" stroke="currentColor" stroke-width="2" />
      <path d="m17 26-4 4 4 4" stroke="currentColor" stroke-width="2" />
      <path d="M51 30h-9" stroke="currentColor" stroke-width="2" />
      <path d="m47 26 4 4-4 4" stroke="currentColor" stroke-width="2" />
    </svg>
    <svg *ngIf="name === 'fabric'" class="lk-product-feature-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M13 27c7-4 13-4 19 0s12 4 19 0" stroke="currentColor" stroke-width="2" />
      <path d="M13 34c7-4 13-4 19 0s12 4 19 0" stroke="currentColor" stroke-width="2" />
      <path d="M13 41c7-4 13-4 19 0s12 4 19 0" stroke="currentColor" stroke-width="2" />
      <path d="M21 21V10" stroke="currentColor" stroke-width="2" />
      <path d="m17 14 4-4 4 4" stroke="currentColor" stroke-width="2" />
      <path d="M32 21V8" stroke="currentColor" stroke-width="2" />
      <path d="m28 12 4-4 4 4" stroke="currentColor" stroke-width="2" />
      <path d="M43 21V10" stroke="currentColor" stroke-width="2" />
      <path d="m39 14 4-4 4 4" stroke="currentColor" stroke-width="2" />
      <path d="M21 46v8" stroke="currentColor" stroke-width="2" />
      <path d="m17 50 4 4 4-4" stroke="currentColor" stroke-width="2" />
      <path d="M32 46v10" stroke="currentColor" stroke-width="2" />
      <path d="m28 52 4 4 4-4" stroke="currentColor" stroke-width="2" />
      <path d="M43 46v8" stroke="currentColor" stroke-width="2" />
      <path d="m39 50 4 4 4-4" stroke="currentColor" stroke-width="2" />
    </svg>
    <svg *ngIf="name === 'waist'" class="lk-product-feature-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M17 12c2.5 8 2.2 14.3-.8 19-2.7 4.2-2.6 9.5.4 15.8" stroke="currentColor" stroke-width="2" />
      <path d="M47 12c-2.5 8-2.2 14.3.8 19 2.7 4.2 2.6 9.5-.4 15.8" stroke="currentColor" stroke-width="2" />
      <path d="M21 22c3.5 2 7.2 3 11 3s7.5-1 11-3" stroke="currentColor" stroke-width="2" />
      <path d="M20 43c4 2 8 3 12 3s8-1 12-3" stroke="currentColor" stroke-width="2" />
      <path d="M14 26h9" stroke="currentColor" stroke-width="2" />
      <path d="m18 22-4 4 4 4" stroke="currentColor" stroke-width="2" />
      <path d="M50 26h-9" stroke="currentColor" stroke-width="2" />
      <path d="m46 22 4 4-4 4" stroke="currentColor" stroke-width="2" />
    </svg>
  `,
})
export class ProductFeatureIconComponent {
  @Input() name = '';
}
