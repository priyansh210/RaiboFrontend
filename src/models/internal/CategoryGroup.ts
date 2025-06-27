export interface CategoryOption {
  id: string;
  name: string;
  count: number;
}

export interface CategoryGroup {
  name: string;
  options: CategoryOption[];
}
