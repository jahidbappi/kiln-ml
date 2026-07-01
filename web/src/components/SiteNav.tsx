"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/benchmarks", label: "Benchmarks" },
  { href: "/docs", label: "Docs" },
];

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#08080c]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20">
            <Flame className="h-4 w-4 text-white" />
          </span>
          <span className="font-semibold tracking-tight text-white group-hover:text-orange-200">Kiln</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/jahidbappi/kiln-ml"
            className={cn(
              "ml-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70",
              "transition hover:border-orange-500/40 hover:text-orange-200"
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
