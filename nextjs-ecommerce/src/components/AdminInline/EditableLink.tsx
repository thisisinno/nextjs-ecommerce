"use client";

import Link from "next/link";
import { ApiContentBlock } from "@/types/content";
import EditableText from "./EditableText";

export default function EditableLink({
  href,
  block,
  fallback,
  className,
}: {
  href: string;
  block?: ApiContentBlock;
  fallback: string;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      <EditableText block={block} fallback={fallback} />
    </Link>
  );
}
