import Image from "next/image";
import Link from "next/link";
import type { ArticleContentBlock } from "@/types/article";

function isExternalLink(href: string) {
  return /^https?:\/\//i.test(href);
}

export function ArticleContent({
  blocks,
}: {
  blocks: ArticleContentBlock[];
}) {
  return (
    <div className="article-content mt-8 space-y-7 sm:mt-10 sm:space-y-9">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const Heading = block.level === 2 ? "h2" : "h3";
            return (
              <Heading
                key={`${block.type}-${index}`}
                className="!mt-10 !font-bold !leading-tight !text-white first:!mt-0"
              >
                {block.text}
              </Heading>
            );
          }
          case "paragraph":
            return (
              <p
                key={`${block.type}-${index}`}
                className="text-base leading-8 text-gray-300 sm:text-lg sm:leading-9"
              >
                {block.text}
              </p>
            );
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List
                key={`${block.type}-${index}`}
                className={`space-y-3 pl-6 text-base leading-8 text-gray-300 sm:text-lg ${
                  block.ordered ? "list-decimal" : "list-disc marker:text-[#ffd43b]"
                }`}
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </List>
            );
          }
          case "link":
            return isExternalLink(block.href) ? (
              <a
                key={`${block.type}-${index}`}
                href={block.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit font-semibold text-[#ffd43b] underline underline-offset-4 hover:text-[#ffe16a]"
              >
                {block.text} <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <Link
                key={`${block.type}-${index}`}
                href={block.href}
                className="w-fit font-semibold text-[#ffd43b] underline underline-offset-4 hover:text-[#ffe16a]"
              >
                {block.text}
              </Link>
            );
          case "image":
            return (
              <figure
                key={`${block.type}-${index}`}
                className="my-10 overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
              >
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={1200}
                  height={750}
                  unoptimized
                  sizes="(min-width: 900px) 800px, 100vw"
                  className="h-auto max-h-[720px] w-full object-contain"
                />
                {block.caption && (
                  <figcaption className="px-4 py-3 text-center text-sm text-gray-400">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
        }
      })}
    </div>
  );
}
