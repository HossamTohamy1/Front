export * from '../../domain/models/category.model';
export * from '../../domain/models/product.model';
export * from '../../data/mock/categories.mock';
export * from '../../data/mock/products.mock';
export * from '../../data/mock/reviews.mock';
export * from '../../data/mock/orders.mock';
export * from '../../data/mock/notifications.mock';

export type Order = import('../../data/mock/orders.mock').LegacyOrder;
export type Notification = import('../../data/mock/notifications.mock').NotificationItem;
