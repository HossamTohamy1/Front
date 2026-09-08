import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { IOrderRepository } from '../../domain/interfaces/order.repository';
import { TrackedOrder, TrackedOrderStatus, TrackedOrderStatusUpdater } from '../../domain/models/order.model';
import { SEED_TRACKED_ORDERS } from '../mock/seed-orders.mock';
import { environment } from '../../../environments/environment';

const STORAGE_KEY = `${environment.storagePrefix}completed-orders`;

@Injectable({
  providedIn: 'root',
})
export class OrderRepositoryImpl implements IOrderRepository {
  private http = inject(HttpClient);

  getOrders(): Observable<TrackedOrder[]> {
    if (!environment.useMockData) {
      return this.http.get<any>(`${environment.apiBaseUrl}/orders`).pipe(
        map(res => {
          const items = res?.data?.data || res?.data || [];
          return items.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber || o.id.split('-')[0].toUpperCase(),
            createdAt: o.createdAt,
            updatedAt: o.createdAt,
            status: o.status,
            paymentStatus: o.paymentMethod === 'CashOnDelivery' ? 'unpaid' : 'paid',
            items: (o.items || []).map((i: any) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.value || i.unitPrice || 0
            })),
            subtotal: o.total || 0,
            shipping: 0,
            discount: 0,
            total: o.total || 0,
            customerName: o.customerName || 'Guest',
            phone: o.phone || '',
            city: o.country || '',
            area: '',
            address: o.address || '',
            paymentMethod: o.paymentMethod === 'BankTransfer' ? 'ØªØ­ÙˆÙŠÙ„ Ø¨Ù†ÙƒÙŠ' : 'Ø§Ù„Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…',
            country: o.country || '',
            deliveryCompany: 'Loxxking Delivery',
            estimatedDelivery: '',
            bankTransferReceipt: o.bankTransfers && o.bankTransfers.length > 0 ? {
              name: 'Receipt',
              type: 'image/jpeg',
              dataUrl: o.bankTransfers[0].proofImageUrl
            } : undefined
          } as TrackedOrder));
        })
      );
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return of(parsed);
        }
      }
      this.saveLocal(SEED_TRACKED_ORDERS);
      return of(SEED_TRACKED_ORDERS);
    } catch {
      return of(SEED_TRACKED_ORDERS);
    }
  }

  getOrderById(id: string): Observable<TrackedOrder | undefined> {
    if (!environment.useMockData) {
      return this.http.get<TrackedOrder>(`${environment.apiBaseUrl}/orders/${id}`);
    }
    return this.getOrders().pipe(map(orders => orders.find(o => o.id === id || o.orderNumber === id)));
  }

  createOrder(order: TrackedOrder): Observable<TrackedOrder> {
    if (!environment.useMockData) {
      const payload = {
        address: order.address,
        phone: order.phone,
        notes: order.notes,
        paymentMethod: order.paymentMethod.includes('ØªØ­ÙˆÙŠÙ„') ? 2 : 1, // 1: COD, 2: BankTransfer
        items: order.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        guestName: order.customerName,
        guestCountryName: order.country
      };

      return this.http.post<any>(`${environment.apiBaseUrl}/orders`, payload).pipe(
        switchMap(response => {
          const orderId = response?.data?.orderId || response?.orderId;
          if (order.bankTransferReceipt && order.bankTransferReceipt.dataUrl && orderId) {
            const arr = order.bankTransferReceipt.dataUrl.split(',');
            const mimeMatch = arr[0].match(/:(.*?);/);
            const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], { type: mime });
            const formData = new FormData();
            formData.append('orderId', orderId);
            formData.append('proofImage', blob, order.bankTransferReceipt.name || 'receipt.jpg');

            return this.http.post(`${environment.apiBaseUrl}/bank-transfers`, formData).pipe(
              map(() => ({ ...order, id: orderId, orderNumber: response?.data?.orderNumber || response?.orderNumber || order.orderNumber })),
              catchError(() => of({ ...order, id: orderId, orderNumber: response?.data?.orderNumber || response?.orderNumber || order.orderNumber }))
            );
          }
          return of({ ...order, id: orderId, orderNumber: response?.data?.orderNumber || response?.orderNumber || order.orderNumber });
        })
      );
    }
    return this.getOrders().pipe(
      map(orders => {
        const next = [order, ...orders.filter(o => o.id !== order.id)];
        this.saveLocal(next);
        return order;
      })
    );
  }

  updateOrder(id: string, updates: Partial<TrackedOrder>): Observable<TrackedOrder> {
    if (!environment.useMockData) {
      return this.http.patch<TrackedOrder>(`${environment.apiBaseUrl}/orders/${id}`, updates);
    }
    return this.getOrders().pipe(
      map(orders => {
        let updated: TrackedOrder | undefined;
        const next = orders.map(o => {
          if (o.id === id || o.orderNumber === id) {
            updated = { ...o, ...updates, updatedAt: new Date().toISOString() };
            return updated;
          }
          return o;
        });
        this.saveLocal(next);
        return updated || (updates as TrackedOrder);
      })
    );
  }

  deleteOrder(id: string): Observable<boolean> {
    if (!environment.useMockData) {
      return this.http.delete<void>(`${environment.apiBaseUrl}/orders/${id}`).pipe(map(() => true));
    }
    return this.getOrders().pipe(
      map(orders => {
        const next = orders.filter(o => o.id !== id && o.orderNumber !== id);
        this.saveLocal(next);
        return true;
      })
    );
  }

  bulkUpdateStatus(ids: string[], status: TrackedOrderStatus, updatedBy?: TrackedOrderStatusUpdater): Observable<boolean> {
    if (!environment.useMockData) {
      return this.http.post<{ success: boolean }>(`${environment.apiBaseUrl}/orders/bulk-status`, { ids, status, updatedBy }).pipe(map(res => res.success));
    }
    return this.getOrders().pipe(
      map(orders => {
        const targetIds = new Set(ids);
        const next = orders.map(o => {
          if (targetIds.has(o.id) || targetIds.has(o.orderNumber)) {
            return {
              ...o,
              status,
              updatedAt: new Date().toISOString(),
              ...(updatedBy ? { statusUpdatedBy: updatedBy } : {}),
            };
          }
          return o;
        });
        this.saveLocal(next);
        return true;
      })
    );
  }

  private saveLocal(orders: TrackedOrder[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {}
  }
}
