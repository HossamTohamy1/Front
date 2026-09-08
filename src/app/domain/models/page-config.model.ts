export type SectionType = 'hero' | 'benefits' | 'categories' | 'bestsellers' | 'promo';

export interface HeroSlide {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

export interface BenefitItem {
  id: string;
  text: string;
  icon: string;
  enabled: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: string;
  rating: number;
  reviewsCount: number;
}

export interface SectionConfig {
  id: string;
  type: SectionType;
  enabled: boolean;
  title?: string;
  image?: string;
  slides?: HeroSlide[];
  benefits?: BenefitItem[];
  categories?: CategoryItem[];
  products?: ProductItem[];
}

export interface PageConfig {
  sections: SectionConfig[];
}
