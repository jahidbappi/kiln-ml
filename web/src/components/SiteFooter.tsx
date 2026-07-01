import Link from "next/link";
import { Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050508] px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-sm text-white/35">
          Kiln · MIT · Forge every algorithm on real data
        </p>
        <div className="flex gap-6 text-sm text-white/45">
          <Link href="/benchmarks" className="hover:text-orange-300">
            Benchmarks
          </Link>
          <Link href="/docs" className="hover:text-orange-300">
            Docs
          </Link>
          <a
            href="https://github.com/jahidbappi/kiln-ml/blob/master/DATASETS.md"
            className="hover:text-orange-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datasets
          </a>
          <a
            href="https://github.com/jahidbappi/kiln-ml"
            className="inline-flex items-center gap-1 hover:text-orange-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
            Source
          </a>
        </div>
      </div>
    </footer>
  );
}
