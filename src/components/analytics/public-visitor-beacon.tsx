"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PublicVisitorBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    void fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      // Analytics must never affect public page rendering.
    });
  }, [pathname]);

  return null;
}
