import Image, { type ImageProps } from "next/image";

type CoverImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/**
 * Cover lokal di /uploads sering gagal lewat optimizer Next (Hostinger/CDN).
 * Serve langsung agar browser membaca magic bytes file.
 */
export function CoverImage({
  src,
  alt,
  unoptimized,
  ...props
}: CoverImageProps) {
  const skipOptimize = unoptimized ?? src.startsWith("/uploads/");
  return (
    <Image src={src} alt={alt} unoptimized={skipOptimize} {...props} />
  );
}
