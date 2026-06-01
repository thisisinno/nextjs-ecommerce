export type ApiFilterOption = {
  id: number;
  filter_group: number;
  label: string;
  value: string;
  product_count: number;
  order: number;
  is_active: boolean;
};

export type ApiFilterGroup = {
  id: number;
  name: string;
  slug: string;
  type: "category" | "gender" | "size" | "color" | "price" | "custom";
  order: number;
  is_active: boolean;
  options: ApiFilterOption[];
};
