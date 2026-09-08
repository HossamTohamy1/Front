import { Review } from '../../domain/models/product.model';

export const reviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Sarah M.',
    rating: 5,
    comment: 'Absolutely love this waist trainer! I can already see a difference after 2 weeks. The quality is amazing and it\'s very comfortable to wear.',
    date: '2025-11-15',
    approved: true,
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: 'Fatima A.',
    rating: 5,
    comment: 'ممتاز جداً! يلتصق الجسم بشكل رائع والخامة عالية الجودة. أنصح به بشدة.',
    date: '2025-11-10',
    approved: true,
  },
  {
    id: 'rev-3',
    productId: 'prod-1',
    userName: 'Jessica L.',
    rating: 4,
    comment: 'Great product! Sizing runs a little small so I\'d suggest going one size up. Otherwise it\'s perfect.',
    date: '2025-10-28',
    approved: true,
  },
  {
    id: 'rev-4',
    productId: 'prod-2',
    userName: 'Noor K.',
    rating: 5,
    comment: 'خامة فاخرة وسلسة تحت الملابس. لا تبرز مطلقاً. أفضل مشد جربته.',
    date: '2025-11-20',
    approved: true,
  },
  {
    id: 'rev-5',
    productId: 'prod-3',
    userName: 'Maria G.',
    rating: 5,
    comment: 'Post C-section this has been a lifesaver. Gentle support, exactly what I needed for recovery.',
    date: '2025-11-18',
    approved: true,
  },
];
