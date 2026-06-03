"use client";

import Link from "next/link";
import { ApiContentBlock } from "@/types/content";
import EditableText from "./EditableText";

export default function EditableLink({
  href,
  block,
  fallback,
  className,
  pageSlug,
  pageTitle,
  sectionKey,
  sectionTitle,
  contentKey,
}: {
  href: string;
  block?: ApiContentBlock | null;
  fallback: string;
  className?: string;
  pageSlug: string;
  pageTitle?: string;
  sectionKey: string;
  sectionTitle?: string;
  contentKey: string;
}) {
  return (
    <Link href={href} className={className}>
      <EditableText
        block={block}
        fallback={fallback}
        pageSlug={pageSlug}
        pageTitle={pageTitle}
        sectionKey={sectionKey}
        sectionTitle={sectionTitle}
        contentKey={contentKey}
        contentType="label"
      />
    </Link>
  );
}
