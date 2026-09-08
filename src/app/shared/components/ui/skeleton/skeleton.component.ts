import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="skeleton {{className}}"></div>`,
  styles: [`:host { display: block; }`]
})
export class SkeletonComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-product-card-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <div class="bg-card rounded-2xl overflow-hidden border border-border">
      <app-skeleton className="w-full aspect-[3/4]"></app-skeleton>
      <div class="p-3 space-y-2">
        <app-skeleton className="h-4 w-3/4"></app-skeleton>
        <app-skeleton className="h-4 w-1/2"></app-skeleton>
        <div class="flex justify-between items-center pt-1">
          <app-skeleton className="h-5 w-16"></app-skeleton>
          <app-skeleton className="h-8 w-8 rounded-full"></app-skeleton>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class ProductCardSkeletonComponent {}

@Component({
  selector: 'app-order-card-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <div class="bg-card rounded-2xl border border-border p-4 space-y-3">
      <div class="flex justify-between">
        <app-skeleton className="h-4 w-32"></app-skeleton>
        <app-skeleton className="h-6 w-20 rounded-full"></app-skeleton>
      </div>
      <app-skeleton className="h-3 w-24"></app-skeleton>
      <app-skeleton className="h-3 w-full"></app-skeleton>
      <app-skeleton className="h-3 w-2/3"></app-skeleton>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class OrderCardSkeletonComponent {}

@Component({
  selector: 'app-stat-card-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <div class="bg-card rounded-2xl border border-border p-5 space-y-3">
      <app-skeleton className="h-4 w-28"></app-skeleton>
      <app-skeleton className="h-8 w-20"></app-skeleton>
      <app-skeleton className="h-3 w-24"></app-skeleton>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class StatCardSkeletonComponent {}

@Component({
  selector: '[app-table-row-skeleton]',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <td *ngFor="let i of colsArray" class="px-4 py-3">
      <app-skeleton className="h-4 w-full"></app-skeleton>
    </td>
  `,
  styles: [`:host { display: table-row; }`]
})
export class TableRowSkeletonComponent {
  @Input() cols: number = 5;
  get colsArray() {
    return Array.from({ length: this.cols });
  }
}

@Component({
  selector: 'app-grid-skeleton',
  standalone: true,
  imports: [CommonModule, ProductCardSkeletonComponent],
  template: `
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 {{className}}">
      <app-product-card-skeleton *ngFor="let i of countArray"></app-product-card-skeleton>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class GridSkeletonComponent {
  @Input() count: number = 4;
  @Input() className = '';
  get countArray() {
    return Array.from({ length: this.count });
  }
}
