import Image from "next/image";

export function ArticleThumbnail({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label="Article thumbnail will appear when an image is uploaded"
        className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl border border-[#ffd43b]/25 bg-[#171713]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,207,50,0.12),transparent_70%)]"
        />
        <div className="relative flex flex-col items-center gap-2 text-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-8 w-8 text-[#ffd43b]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="text-sm text-gray-400">
            Article thumbnail will appear here
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#171717]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
      />
    </div>
  );
}
