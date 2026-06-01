import { ApiContentBlock, ApiPage } from "@/types/content";

export type ContentLookup = Record<string, ApiContentBlock>;

export function mapPageContent(page: ApiPage): ContentLookup {
  return page.sections.reduce<ContentLookup>((lookup, section) => {
    section.blocks.forEach((block) => {
      lookup[`${section.key}.${block.key}`] = block;
    });
    return lookup;
  }, {});
}

export const contentValue = (lookup: ContentLookup, key: string, fallback: string) =>
  lookup[key]?.value || fallback;
