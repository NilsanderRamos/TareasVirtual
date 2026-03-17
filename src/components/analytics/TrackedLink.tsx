"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { AnalyticsPayload, trackSiteEvent } from "@/lib/analytics";

interface TrackedLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  eventName: string;
  payload?: AnalyticsPayload;
}

export function TrackedLink({ href, className, children, eventName, payload }: TrackedLinkProps) {
  const isExternal = href.startsWith("mailto:") || href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        onClick={() => trackSiteEvent(eventName, { href, ...payload })}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackSiteEvent(eventName, { href, ...payload })}
    >
      {children}
    </Link>
  );
}