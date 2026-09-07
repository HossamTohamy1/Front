export type FilterSelectionKey =
  | 'status'
  | 'country'
  | 'city'
  | 'area'
  | 'gender'
  | 'deliveryCompany'
  | 'paymentMethod'
  | 'product';

export type FilterSelections = Partial<Record<FilterSelectionKey, string>>;

export interface FilterOption {
  value: string;
  count: number;
}

export interface FilterShortcut {
  key: string;
  label: string;
  icon: any;
}
