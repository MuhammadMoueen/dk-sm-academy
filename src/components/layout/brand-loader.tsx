import Image from "next/image";

export function BrandLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="flex min-h-[100svh] items-center justify-center bg-[#080808]"
    >
      <div className="relative flex h-[76px] w-[76px] items-center justify-center">
        <span aria-hidden="true" className="brand-loader-ring" />
        <Image
          src="/icon.png"
          alt=""
          width={52}
          height={52}
          priority
          className="h-[52px] w-[52px] object-contain"
        />
      </div>
    </div>
  );
}
