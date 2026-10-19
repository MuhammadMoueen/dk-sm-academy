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
    <div className="article-content space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const Heading = block.level === 2 ? "h2" : "h3";
            return (
              <Heading
                key={`${block.type}-${index}`}
                className="!mt-10 !font-bold !text-white"
              >
                {block.text}
              </Heading>
            );
          }
          case "paragraph":
            return (
              <p
                key={`${block.type}-${index}`}
                className="leading-8 text-gray-300"
              >
                {block.text}
              </p>
            );
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List
                key={`${block.type}-${index}`}
                className={`space-y-2 pl-6 leading-7 text-gray-300 ${
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
                className="my-8 overflow-hidden rounded-2xl border border-[#ffd43b]/20 bg-[#111]"
              >
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={1200}
                  height={750}
                  unoptimized
                  sizes="(min-width: 900px) 800px, 100vw"
                  className="h-auto w-full object-cover"
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
