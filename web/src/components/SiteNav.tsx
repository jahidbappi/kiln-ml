import Link from "next/link";

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Kiln
        </Link>
        <nav className="flex gap-6 text-sm text-white/70">
          <Link href="/benchmarks" className="hover:text-white">
            Benchmarks
          </Link>
          <a
            href="https://github.com/jahidbappi/kiln-ml"
            className="hover:text-white"
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
