import { Observable } from 'rxjs';
import { TrackedOrder, TrackedOrderStatus, TrackedOrderStatusUpdater } from '../models/order.model';

export interface IOrderRepository {
  getOrders(): Observable<TrackedOrder[]>;
  getOrderById(id: string): Observable<TrackedOrder | undefined>;
  createOrder(order: TrackedOrder): Observable<TrackedOrder>;
  updateOrder(id: string, updates: Partial<TrackedOrder>): Observable<TrackedOrder>;
  deleteOrder(id: string): Observable<boolean>;
  bulkUpdateStatus(ids: string[], status: TrackedOrderStatus, updatedBy?: TrackedOrderStatusUpdater): Observable<boolean>;
}
