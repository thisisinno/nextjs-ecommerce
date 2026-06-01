import { ApiMediaAsset } from "./media";

export type ApiContentBlock = {
  id: number;
  section: number;
  key: string;
  content_type: string;
  value: string;
  media?: number | null;
  media_detail?: ApiMediaAsset | null;
  order: number;
  metadata: Record<string, unknown>;
  is_active: boolean;
};

export type ApiSection = {
  id: number;
  page: number;
  key: string;
  title: string;
  section_type: string;
  order: number;
  is_active: boolean;
  blocks: ApiContentBlock[];
};

export type ApiPage = {
  id: number;
  slug: string;
  title: string;
  is_active: boolean;
  sections: ApiSection[];
};

export type ApiMenuItem = {
  id: number;
  title: string;
  path: string;
  order: number;
  is_active: boolean;
  metadata: Record<string, unknown>;
  children?: ApiMenuItem[];
};

export type ApiMenu = {
  id: number;
  name: string;
  location: string;
  is_active: boolean;
  items: ApiMenuItem[];
};
