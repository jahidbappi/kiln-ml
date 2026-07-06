import { Crown } from "lucide-react";
import { formatMetric, type TrackFile } from "@/lib/benchmarks";

type Props = {
  track: TrackFile;
  accent?: string;
};

export function TrackSection({ track, accent = "border-white/10" }: Props) {
  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold capitalize text-white">{track.track}</h2>
          <p className="mt-1 text-sm text-white/45">
            {track.dataset}
            {track.num_samples > 0 ? ` · ${track.num_samples.toLocaleString()} samples` : ""}
          </p>
        </div>
      </div>

      <div className={`mt-5 overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent ${accent}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                <th className="px-5 py-4">Rank</th>
                <th className="px-5 py-4">Model</th>
                <th className="px-5 py-4">Dataset</th>
                <th className="px-5 py-4">Tool</th>
                <th className="px-5 py-4">Score</th>
                <th className="px-5 py-4">Train</th>
              </tr>
            </thead>
            <tbody>
              {track.results.slice(0, 15).map((row, i) => (
                <tr
                  key={row.name}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3.5 text-white/35">
                    {i === 0 ? (
                      <span className="inline-flex items-center gap-1 text-amber-400">
                        <Crown className="h-3.5 w-3.5" /> 1
                      </span>
                    ) : (
                      i + 1
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-white/90">{row.model}</td>
                  <td className="px-5 py-3.5 text-white/50">{row.dataset}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-xs text-white/55">
                      {row.tool}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-orange-300">{formatMetric(row)}</td>
                  <td className="px-5 py-3.5 text-white/35">
                    {row.metrics.train_time_ms != null ? `${row.metrics.train_time_ms.toFixed(0)} ms` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {track.citation && (
        <p className="mt-3 text-xs leading-relaxed text-white/30">{track.citation}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/35">
        <span>Updated {new Date(track.timestamp).toLocaleDateString()}</span>
        {track.commit && (
          <span>
            commit <code className="text-orange-300/70">{track.commit}</code>
          </span>
        )}
        {track.source_url && (
          <a
            href={track.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400/80 hover:text-orange-300"
          >
            Dataset source
          </a>
        )}
      </div>
    </section>
  );
}
