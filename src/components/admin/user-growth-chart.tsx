"use client";

import { useEffect, useMemo, useState } from "react";

type Point = { label: string; date: string; visits: number };
type Period = "month" | "year";

export function UserGrowthChart() {
  const now = new Date();
  const [period, setPeriod] = useState<Period>("year");
  const [year, setYear] = useState(now.getUTCFullYear());
  const [month, setMonth] = useState(now.getUTCMonth() + 1);
  const [points, setPoints] = useState<Point[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const query = new URLSearchParams({
      period,
      year: String(year),
      month: String(month),
    });
    void fetch(`/api/admin/analytics?${query}`, { cache: "no-store" })
      .then(async (response) => {
        const result = (await response.json()) as {
          points?: Point[];
          total?: number;
          error?: string;
        };
        if (!response.ok) throw new Error(result.error ?? "Analytics could not be loaded.");
        if (active) {
          setPoints(result.points ?? []);
          setTotal(result.total ?? 0);
        }
      })
      .catch((caught) => {
        if (active) setError(caught instanceof Error ? caught.message : "Analytics could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [month, period, year]);

  const max = Math.max(...points.map((point) => point.visits), 1);
  const chart = useMemo(() => {
    if (!points.length) return "";
    const width = 900;
    const height = 260;
    const x = (index: number) =>
      points.length === 1 ? width / 2 : (index / (points.length - 1)) * width;
    const y = (value: number) => height - (value / max) * (height - 24);
    return points.map((point, index) => `${x(index)},${y(point.visits)}`).join(" ");
  }, [max, points]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-[#ffd43b]/30 p-1">
          {(["month", "year"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              className={`min-h-9 rounded-md px-4 text-sm font-semibold capitalize transition ${
                period === value ? "bg-[#ffd43b] text-black" : "text-gray-300 hover:text-white"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        {period === "month" && (
          <select
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className="min-h-11 rounded-lg border border-white/15 bg-[#090909] px-3 text-sm text-white outline-none focus:border-[#ffd43b]"
            aria-label="Analytics month"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(Date.UTC(2020, index, 1)))}
              </option>
            ))}
          </select>
        )}
        <select
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
          className="min-h-11 rounded-lg border border-white/15 bg-[#090909] px-3 text-sm text-white outline-none focus:border-[#ffd43b]"
          aria-label="Analytics year"
        >
          {Array.from({ length: 5 }, (_, index) => {
            const value = now.getUTCFullYear() - index;
            return <option key={value} value={value}>{value}</option>;
          })}
        </select>
      </div>
      <div className="mt-3 text-sm text-gray-400">
        {loading ? "Loading visitor data…" : `${total.toLocaleString()} visits in this period`}
      </div>
      <div className="relative mt-5 min-h-[260px] overflow-x-auto">
        {error ? (
          <p role="alert" className="py-16 text-center text-sm text-red-200">{error}</p>
        ) : !loading && total === 0 ? (
          <p className="py-16 text-center text-sm text-gray-400">No visitor data yet</p>
        ) : (
          <svg viewBox="0 0 900 284" className="h-[260px] min-w-[620px] w-full" role="img" aria-label="Visitor growth chart">
            <g stroke="rgba(255,255,255,0.1)">
              {[0, 1, 2, 3].map((line) => <line key={line} x1="0" x2="900" y1={24 + line * 78} y2={24 + line * 78} />)}
            </g>
            <polyline points={chart} fill="none" stroke="#ffd43b" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            {points.map((point, index) => (
              <circle key={point.date} cx={points.length === 1 ? 450 : (index / (points.length - 1)) * 900} cy={260 - (point.visits / max) * 236} r="4" fill="#ffd43b">
                <title>{`${point.label}: ${point.visits} visits`}</title>
              </circle>
            ))}
            <g fill="#9ca3af" fontSize="12">
              {points.filter((_, index) => period === "year" || index % 5 === 0).map((point) => {
                const index = points.indexOf(point);
                return <text key={point.date} x={points.length === 1 ? 450 : (index / (points.length - 1)) * 900} y="282" textAnchor="middle">{point.label}</text>;
              })}
            </g>
          </svg>
        )}
      </div>
    </>
  );
}
