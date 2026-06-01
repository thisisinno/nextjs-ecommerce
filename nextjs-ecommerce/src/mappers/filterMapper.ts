import { ApiFilterGroup, ApiFilterOption } from "@/types/filter";

export type FrontendFilterOption = {
  id: number;
  name: string;
  value: string;
  products: number;
  isRefined?: boolean;
};

export type FrontendFilterGroup = {
  id: number;
  name: string;
  slug: string;
  type: ApiFilterGroup["type"];
  options: FrontendFilterOption[];
};

export const mapFilterOption = (option: ApiFilterOption): FrontendFilterOption => ({
  id: option.id,
  name: option.label,
  value: option.value,
  products: option.product_count,
});

export const mapFilterGroup = (group: ApiFilterGroup): FrontendFilterGroup => ({
  id: group.id,
  name: group.name,
  slug: group.slug,
  type: group.type,
  options: group.options.map(mapFilterOption),
});

export const mapFilterGroups = (groups: ApiFilterGroup[]) => groups.map(mapFilterGroup);
