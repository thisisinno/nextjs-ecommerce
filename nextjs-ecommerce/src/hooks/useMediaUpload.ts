"use client";

import { useState } from "react";
import { uploadMedia } from "@/lib/api/media";
import { ApiMediaAsset } from "@/types/media";

export function useMediaUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File, payload: Partial<ApiMediaAsset> = {}) => {
    setUploading(true);
    try {
      return await uploadMedia(file, payload);
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
