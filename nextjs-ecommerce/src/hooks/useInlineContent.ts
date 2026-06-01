"use client";

import { useCallback, useEffect, useState } from "react";
import { getPage, updateContentBlock } from "@/lib/api/content";
import { mapPageContent, ContentLookup } from "@/mappers/contentMapper";
import { ApiContentBlock } from "@/types/content";

export function useInlineContent(pageSlug: string) {
  const [content, setContent] = useState<ContentLookup>({});

  useEffect(() => {
    getPage(pageSlug)
      .then((page) => setContent(mapPageContent(page)))
      .catch(() => setContent({}));
  }, [pageSlug]);

  const saveBlock = useCallback(async (block: ApiContentBlock, value: string) => {
    const updated = await updateContentBlock(block.id, { value });
    setContent((current) => ({ ...current, [block.key]: updated }));
    return updated;
  }, []);

  return { content, saveBlock };
}
