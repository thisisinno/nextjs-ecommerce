export type ApiMediaAsset = {
  id: number;
  file: string;
  file_url?: string;
  alt_text: string;
  caption: string;
  crop_data: Record<string, unknown>;
  adjustment_data: Record<string, unknown>;
  original_width?: number | null;
  original_height?: number | null;
};
