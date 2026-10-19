"use client";

import { usePathname } from "next/navigation";
import { useEffect, type AnchorHTMLAttributes } from "react";

type HomepageAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  sectionId: string;
};

export function HomepageAnchor({
  sectionId,
  onClick,
  ...props
}: HomepageAnchorProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/" || !window.location.hash) {
      return;
    }

    const sectionIdFromHash = window.location.hash.slice(1);
    const frameId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById(sectionIdFromHash)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [pathname]);

  return (
    <a
      href={pathname === "/" ? `#${sectionId}` : `/#${sectionId}`}
      {...props}
      onClick={(event) => {
        onClick?.(event);

        if (pathname === "/") {
          event.preventDefault();

          if (window.location.hash !== `#${sectionId}`) {
            window.history.pushState(null, "", `#${sectionId}`);
          }

          document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }}
    />
  );
}
