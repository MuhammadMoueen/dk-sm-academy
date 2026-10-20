
import Image from "next/image";
import type { PortfolioItem } from "@/types/portfolio";

function ImagePlaceholder({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${title}. ${detail}`}
      className="flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-xl border border-[#ffd43b]/35 bg-[#202020] px-4 text-center"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-8 w-8 text-[#ffd43b]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>

      <span className="font-semibold text-[#ffd43b]">
        {title}
      </span>

      <span className="text-sm text-gray-400">
        {detail}
      </span>
    </div>
  );
}

function ClientAvatar({ item }: { item?: PortfolioItem }) {
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#303030] ring-1 ring-[#ffd43b]/30">
      {item?.clientImage ? (
        <Image
          src={item.clientImage}
          alt={`${item.clientName} profile`}
          fill
          sizes="56px"
          className="object-cover"
        />
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-7 w-7 text-[#ffd43b]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 21v-1.5a6.5 6.5 0 0 1 13 0V21" />
        </svg>
      )}
    </div>
  );
}

export function PortfolioCard({
  item,
  preview = false,
}: {
  item?: PortfolioItem;
  preview?: boolean;
}) {
  return (
    <article className="group relative flex min-w-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#ffd43b]/35 bg-[#111]/90 p-3 shadow-[0_12px_34px_rgba(0,0,0,0.32)] transition duration-300 hover:-translate-y-1 hover:border-[#ffd43b]/70 hover:shadow-[0_16px_40px_rgba(255,207,50,0.12)] motion-reduce:transform-none motion-reduce:transition-none sm:p-4">
      {/* Transaction screenshot */}
      {item?.transactionImage ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-[#ffd43b]/20 bg-[#202020]">
          <Image
            src={item.transactionImage}
            alt={`Transaction screenshot shared by ${item.clientName}`}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 86vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none"
          />
        </div>
      ) : (
        <ImagePlaceholder
          title="Transaction Screenshot"
          detail={
            preview
              ? "Admin-uploaded image will appear here"
              : "No transaction image is available"
          }
        />
      )}

      {/* Client profile */}
      <div className="flex min-w-0 items-center gap-3 px-1 pb-1 pt-4">
        <ClientAvatar item={item} />

        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate text-lg font-bold text-[#ffd43b]">
            {item?.clientName ?? "Client name"}
          </h3>

          {item ? (
            <time
              dateTime={item.createdAt}
              className="text-xs text-gray-400"
            >
              {new Intl.DateTimeFormat("en", {
                dateStyle: "medium",
              }).format(new Date(item.createdAt))}
            </time>
          ) : (
            <span className="text-xs text-gray-400">
              {preview ? "Client profile photo" : "Profile photo"}
            </span>
          )}
        </div>
      </div>

      {/* Client review */}
      <div className="mt-3 flex-1 rounded-xl border border-[#ffd43b]/10 bg-white/[0.02] p-3">
        <div
          aria-hidden="true"
          className="mb-2 text-lg leading-none tracking-[0.15em] text-[#ffd43b]"
        >
          ★★★★★
        </div>

        <p className="text-sm leading-relaxed text-gray-300">
          {item?.review ??
            (preview
              ? "Client review will appear here after the entry is published."
              : "A client review will appear here when an entry is published.")}
        </p>
      </div>
    </article>
  );
}
