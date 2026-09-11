export type SectionType = 'hero' | 'benefits' | 'categories' | 'bestsellers' | 'promo';

export interface HeroSlide {
    id: string;
    image: string;
    title?: string;
    titleAr?: string;
    titleEn?: string;
    subtitle?: string;
    subtitleAr?: string;
    subtitleEn?: string;
    link?: string;
}
export interface BenefitItem {
    id: string;
    text: string;
    textAr?: string;
    textEn?: string;
    icon: string;
    enabled: boolean;
}

export interface CategoryItem {
    id: string;
    name: string;
    nameAr?: string;
    nameEn?: string;
    image: string;
}

export interface ProductItem {
    id: string;
    productId?: string;
    name: string;
    nameAr?: string;
    nameEn?: string;
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
    titleAr?: string;
    titleEn?: string;
    image?: string;
    showTitle?: boolean;
    slides?: HeroSlide[];
    
    benefits?: BenefitItem[];
    categories?: CategoryItem[];
    products?: ProductItem[];
}

export interface PageConfig {
    sections: SectionConfig[];
}
