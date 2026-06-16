"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTrackEvent } from "@/lib/analytics";

export default function PageviewTracker() {
  const pathname = usePathname();
  const track = useTrackEvent();

  useEffect(() => {
    track("pageview", { path: pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
