"use client";

import { useEffect, useMemo, useState } from "react";

export default function MediaEditModal({
  file,
  onClose,
  onSave,
}: {
  file: File;
  onClose: () => void;
  onSave: (file: File, metadata: Record<string, unknown>) => Promise<void>;
}) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotate, setRotate] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [saving, setSaving] = useState(false);
  const preview = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => () => URL.revokeObjectURL(preview), [preview]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-dark/50 px-4">
      <div className="w-full max-w-[720px] rounded-lg bg-white p-5 shadow-2">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-medium text-dark">Edit image</p>
          <button type="button" onClick={onClose} className="text-dark-4">Close</button>
        </div>
        <div className="grid gap-5 md:grid-cols-[1fr_240px]">
          <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded border border-gray-3 bg-gray-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt=""
              className="max-h-[420px] max-w-full"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                transform: `rotate(${rotate}deg) scale(${zoom / 100})`,
              }}
            />
          </div>
          <div className="space-y-4">
            {[
              ["Zoom", zoom, setZoom, 50, 200],
              ["Rotate", rotate, setRotate, -180, 180],
              ["Brightness", brightness, setBrightness, 50, 150],
              ["Contrast", contrast, setContrast, 50, 150],
              ["Saturation", saturation, setSaturation, 0, 200],
            ].map(([label, value, setter, min, max]) => (
              <label key={label as string} className="block text-custom-sm text-dark">
                {label as string}
                <input
                  type="range"
                  min={min as number}
                  max={max as number}
                  value={value as number}
                  onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))}
                  className="mt-2 w-full"
                />
              </label>
            ))}
            <button type="button" onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); setRotate(0); setZoom(100); }} className="text-blue">
              Reset
            </button>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-[5px] border border-gray-3 px-4 py-2 text-dark">Cancel</button>
          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await onSave(file, { adjustment_data: { brightness, contrast, saturation, rotate, zoom } });
              } finally {
                setSaving(false);
              }
            }}
            className="rounded-[5px] bg-blue px-4 py-2 text-white"
          >
            {saving ? "Saving" : "Save image"}
          </button>
        </div>
      </div>
    </div>
  );
}
