import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
﻿import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FilterSelectionKey, FilterShortcut, FilterOption, FilterSelections } from '../../domain/models/filter.model';

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <section class="dashboard-filters" aria-label="فلاتر الطلبات">
      <div class="dashboard-filter-control" *ngFor="let item of filterShortcuts">
        <button
          type="button"
          class="dashboard-filter-card"
          [class.dashboard-filter-card--active]="isFilterActive(item.key) || (filterKeyMap[item.key] && openFilterKey === filterKeyMap[item.key])"
          (click)="filterToggle.emit(item.key)"
        >
          <span class="dashboard-filter-card__icon">
            <lucide-icon [img]="item.icon" [size]="15" strokeWidth="2"></lucide-icon>
          </span>
          <span class="dashboard-filter-card__label">{{ getFilterCardLabel(item.key, item.label) | translate }}</span>
        </button>

        <div
          class="dashboard-filter-dropdown"
          *ngIf="filterKeyMap[item.key] && openFilterKey === filterKeyMap[item.key]"
          role="dialog"
        >
          <input
            autoFocus
            [ngModel]="filterSearchQuery"
            (ngModelChange)="searchChange.emit($event)"
            placeholder="بحث..."
          />
          <div class="dashboard-filter-dropdown__list">
            <button
              type="button"
              [class.is-selected]="!filterSelections[filterKeyMap[item.key]!]"
              (click)="filterClear.emit(filterKeyMap[item.key]!)"
            >
              <span class="dashboard-filter-dropdown__option-main"><span>{{ 'COMMON.ALL' | translate }}</span></span>
              <small class="dashboard-number">({{ totalOrdersCount }})</small>
            </button>

            <button
              type="button"
              *ngFor="let option of activeFilterOptions"
              [class.is-selected]="filterSelections[filterKeyMap[item.key]!] === option.value"
              (click)="filterSelect.emit({ key: filterKeyMap[item.key]!, value: option.value })"
            >
              <span class="dashboard-filter-dropdown__option-main">
                <span *ngIf="item.key === 'country-filter'" class="dashboard-filter-dropdown__flag">🇸🇦</span>
                <span>{{ option.value }}</span>
              </span>
              <small class="dashboard-number">({{ option.count }})</small>
            </button>

            <p class="dashboard-filter-dropdown__empty" *ngIf="activeFilterOptions.length === 0">{{ 'COMMON.NO_RESULTS' | translate }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class DashboardFiltersComponent {
  @Input() filterShortcuts: FilterShortcut[] = [];
  @Input() filterKeyMap: Partial<Record<string, FilterSelectionKey>> = {};
  @Input() filterSelections: FilterSelections = {};
  @Input() openFilterKey: FilterSelectionKey | null = null;
  @Input() filterSearchQuery = '';
  @Input() activeFilterOptions: FilterOption[] = [];
  @Input() totalOrdersCount = 0;

  @Output() filterToggle = new EventEmitter<string>();
  @Output() filterSelect = new EventEmitter<{ key: FilterSelectionKey; value: string }>();
  @Output() filterClear = new EventEmitter<FilterSelectionKey>();
  @Output() searchChange = new EventEmitter<string>();

  getFilterCardLabel(key: string, defaultLabel: string): string {
    const mapped = this.filterKeyMap[key];
    if (mapped && this.filterSelections[mapped]) {
      return this.filterSelections[mapped]!;
    }
    return defaultLabel;
  }

  isFilterActive(key: string): boolean {
    const mapped = this.filterKeyMap[key];
    return mapped ? Boolean(this.filterSelections[mapped]) : false;
  }
}

