"use client";

import { ButtonHTMLAttributes } from "react";
import { ApiContentBlock } from "@/types/content";
import EditableText from "./EditableText";

export default function EditableButton({
  block,
  fallback,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { block?: ApiContentBlock; fallback: string }) {
  return (
    <button className={className} {...props}>
      <EditableText block={block} fallback={fallback} />
    </button>
  );
}
