export interface ManagedCategory {
  id: string;
  name: string;
  count: number;
  image?: string;
  slug?: string;
}

export interface ManagedProduct {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  categoryName?: string;
  image?: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
}

export interface ManagedOffer {
  id: string;
  title: string;
  type: string;
  value: number;
  active: boolean;
}
