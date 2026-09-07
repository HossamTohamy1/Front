import { Injectable, signal, computed, inject } from '@angular/core';
import {
  TrackedOrder,
  TrackedOrderStatus,
  TrackedOrderPaymentStatus,
  TrackedOrderStatusUpdater,
  TrackedOrderHistoryEntry,
  TrackedOrderViewerEntry,
  TrackedOrderItem,
} from '../../../domain/models/order.model';
import { OrderRepositoryImpl } from '../../../data/repositories/order.repository.impl';
import { ORDER_STATUS_LABELS } from '../../../domain/enums/order-status.enum';
import { PAYMENT_STATUS_LABELS } from '../../../domain/enums/payment-status.enum';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private repo = inject(OrderRepositoryImpl);

  readonly orders = signal<TrackedOrder[]>([]);

  readonly totalOrders = computed(() => this.orders().length);
  readonly confirmedOrders = computed(() => this.orders().filter(o => o.status === 'confirmed').length);
  readonly pendingApprovals = computed(() => this.orders().filter(o => o.status === 'pending-approval' || o.bankTransferReceipt).length);

  readonly statusLabels = ORDER_STATUS_LABELS;
  readonly paymentStatusLabels = PAYMENT_STATUS_LABELS;

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.repo.getOrders().subscribe(list => this.orders.set(list));
  }

  getOrders(): TrackedOrder[] {
    return this.orders();
  }

  getOrderById(id: string): TrackedOrder | undefined {
    return this.orders().find(o => o.id === id || o.orderNumber === id);
  }

  saveTrackedOrder(order: TrackedOrder): void {
    this.repo.createOrder(order).subscribe(() => this.refresh());
  }

  updateTrackedOrder(id: string, updates: Partial<TrackedOrder>): void {
    this.repo.updateOrder(id, updates).subscribe(() => this.refresh());
  }

  deleteTrackedOrder(id: string): void {
    this.repo.deleteOrder(id).subscribe(() => this.refresh());
  }

  bulkUpdateStatus(ids: string[], status: TrackedOrderStatus, updatedBy?: TrackedOrderStatusUpdater): void {
    this.repo.bulkUpdateStatus(ids, status, updatedBy).subscribe(() => this.refresh());
  }

  incrementTrackedOrderView(id: string, viewer?: TrackedOrderStatusUpdater): void {
    const order = this.getOrderById(id);
    if (!order) return;
    const viewEntry: TrackedOrderViewerEntry = {
      id: `view-${Date.now()}`,
      viewedAt: new Date().toISOString(),
      viewedBy: viewer || { name: 'ORDER.ADMIN' },
    };
    this.updateTrackedOrder(id, {
      viewCount: (order.viewCount || 0) + 1,
      viewHistory: [viewEntry, ...(order.viewHistory || [])],
    });
  }

  addTrackedOrderHistory(id: string, history: Omit<TrackedOrderHistoryEntry, 'id' | 'updatedAt'>): void {
    const order = this.getOrderById(id);
    if (!order) return;
    const entry: TrackedOrderHistoryEntry = {
      ...history,
      id: `hist-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    this.updateTrackedOrder(id, {
      editHistory: [entry, ...(order.editHistory || [])],
    });
  }
}
