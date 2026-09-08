export type ProductColor = 'black' | 'beige';
export type ProductType = 'waist' | 'postpartum' | 'full-body' | 'sport' | 'men' | 'women';
export type PriceFilter = 'all' | 'under-210' | '210-240' | 'over-240';
export type SortMode = 'bestseller' | 'latest';
export type ViewMode = 'grid' | 'list';
export type FilterName = 'type' | 'price' | 'color' | 'size' | null;

export interface ShaperCatalogItem {
  key: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  color: string;
  type: string;
  sizes: string[];
  bestsellerRank: number;
  latestRank: number;
  instanceId?: string;
}

export const SHAPER_TEMPLATES: ShaperCatalogItem[] = [
  { key: 'classic-black', productId: 'prod-1', name: 'PRODUCT.CLASSIC_WAIST_SHAPER', image: '/assets/categories/category-men-reference.png', price: 200, originalPrice: 250, rating: 4.9, reviews: 256, color: 'black', type: 'waist', sizes: ['M', 'L', 'XL', '2XL'], bestsellerRank: 1, latestRank: 11 },
  { key: 'daily-beige', productId: 'prod-6', name: 'PRODUCT.DAILY_SQUARE_SHAPER', image: '/assets/categories/category-women-reference.png', price: 195, originalPrice: 250, rating: 4.8, reviews: 94, color: 'beige', type: 'waist', sizes: ['S', 'M', 'L', 'XL'], bestsellerRank: 3, latestRank: 14 },
  { key: 'postpartum', productId: 'prod-3', name: 'PRODUCT.POSTPARTUM_SHAPER', image: '/assets/categories/category-postpartum-reference.png', price: 210, originalPrice: 250, rating: 4.8, reviews: 96, color: 'beige', type: 'postpartum', sizes: ['M', 'L', 'XL', '2XL', '3XL'], bestsellerRank: 2, latestRank: 4 },
  { key: 'full-body', productId: 'prod-2', name: 'PRODUCT.FULL_BODY_SHAPER', image: '/assets/categories/category-full-body-reference.png', price: 260, originalPrice: 320, rating: 4.8, reviews: 112, color: 'black', type: 'full-body', sizes: ['M', 'L', 'XL', '2XL', '3XL'], bestsellerRank: 4, latestRank: 8 },
  { key: 'sport-black', productId: 'prod-8', name: 'PRODUCT.SPORTS_SHAPER', image: '/assets/categories/category-sport-reference.png', price: 230, originalPrice: 270, rating: 4.7, reviews: 76, color: 'black', type: 'sport', sizes: ['S', 'M', 'L', 'XL', '2XL'], bestsellerRank: 5, latestRank: 2 },
  { key: 'shorts', productId: 'prod-5', name: 'PRODUCT.SHORTS_SHAPER', image: '/assets/categories/category-waist-reference.png', price: 220, originalPrice: 245, rating: 4.6, reviews: 88, color: 'beige', type: 'postpartum', sizes: ['M', 'L', 'XL', '2XL'], bestsellerRank: 7, latestRank: 1 },
  { key: 'men', productId: 'prod-4', name: 'PRODUCT.MEN_SHAPER', image: '/assets/categories/category-men-reference.png', price: 240, originalPrice: 280, rating: 4.6, reviews: 64, color: 'black', type: 'men', sizes: ['M', 'L', 'XL', '2XL', '3XL'], bestsellerRank: 8, latestRank: 6 },
  { key: 'postpartum-double', productId: 'prod-3', name: 'PRODUCT.POSTPARTUM_DOUBLE_SHAPER', image: '/assets/categories/category-postpartum-reference.png', price: 250, originalPrice: 290, rating: 4.7, reviews: 71, color: 'beige', type: 'postpartum', sizes: ['S', 'M', 'L', 'XL', '2XL'], bestsellerRank: 6, latestRank: 3 },
  { key: 'front-open', productId: 'prod-7', name: 'PRODUCT.FRONT_OPEN_SHAPER', image: '/assets/categories/category-women-reference.png', price: 270, originalPrice: 315, rating: 4.6, reviews: 53, color: 'black', type: 'women', sizes: ['S', 'M', 'L', 'XL'], bestsellerRank: 10, latestRank: 5 },
  { key: 'sport-waist', productId: 'prod-8', name: 'PRODUCT.FLEXIBLE_SPORT_SHAPER', image: '/assets/categories/category-sport-reference.png', price: 235, originalPrice: 275, rating: 4.7, reviews: 83, color: 'black', type: 'sport', sizes: ['XS', 'S', 'M', 'L', 'XL'], bestsellerRank: 9, latestRank: 7 },
  { key: 'body-sculpt', productId: 'prod-2', name: 'PRODUCT.BODY_SCULPT_SHAPER', image: '/assets/categories/category-full-body-reference.png', price: 265, originalPrice: 330, rating: 4.8, reviews: 101, color: 'black', type: 'full-body', sizes: ['S', 'M', 'L', 'XL', '2XL'], bestsellerRank: 11, latestRank: 9 },
  { key: 'waist-beige', productId: 'prod-1', name: 'PRODUCT.BEIGE_WAIST_SHAPER', image: '/assets/categories/category-waist-reference.png', price: 205, originalPrice: 255, rating: 4.6, reviews: 69, color: 'beige', type: 'waist', sizes: ['S', 'M', 'L', 'XL', '2XL'], bestsellerRank: 12, latestRank: 10 },
];

export const ALL_SHAPERS_CATALOG_ITEMS: ShaperCatalogItem[] = Array.from({ length: 24 }, (_, index) => {
  const template = SHAPER_TEMPLATES[index % SHAPER_TEMPLATES.length];
  const cycle = Math.floor(index / SHAPER_TEMPLATES.length);
  return {
    ...template,
    instanceId: `${template.key}-${index + 1}`,
    price: template.price + cycle * 5,
    originalPrice: template.originalPrice ? template.originalPrice + cycle * 5 : undefined,
    reviews: template.reviews + cycle * 7,
    bestsellerRank: template.bestsellerRank + cycle * 12,
    latestRank: template.latestRank + cycle * 12,
  };
});
