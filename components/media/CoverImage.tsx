"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK_SRC = "/logo.png";

type CoverImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/**
 * Cover /uploads dilayani tanpa optimizer (Hostinger sering 400).
 * Jika file hilang (redeploy lama), jatuh ke logo.
 */
export function CoverImage({
  src,
  alt,
  unoptimized,
  ...props
}: CoverImageProps) {
  const [current, setCurrent] = useState(src || FALLBACK_SRC);
  const skipOptimize =
    unoptimized ??
    (current.startsWith("/uploads/") || current === FALLBACK_SRC);

  return (
    <Image
      src={current}
      alt={alt}
      unoptimized={skipOptimize}
      onError={() => {
        if (current !== FALLBACK_SRC) {
          setCurrent(FALLBACK_SRC);
        }
      }}
      {...props}
    />
  );
}
