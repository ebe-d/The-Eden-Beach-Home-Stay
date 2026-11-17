"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const OPTIMIZED_HOSTS = new Set([
  "images.unsplash.com",
  "upload.wikimedia.org",
  "thumb.wikimedia.org",
]);

function isOptimizedSource(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    const parsed = new URL(src);
    return OPTIMIZED_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

type CoastalImageProps = Omit<ImageProps, "src"> & {
  src: string;
  fallbackSrc?: string;
};

export function CoastalImage({
  src,
  fallbackSrc = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  alt,
  unoptimized,
  ...rest
}: CoastalImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const shouldBypassOptimizer =
    unoptimized !== undefined ? unoptimized : !isOptimizedSource(imgSrc);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      unoptimized={shouldBypassOptimizer}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}

