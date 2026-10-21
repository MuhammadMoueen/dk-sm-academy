"use client";

import { useEffect, useMemo, useState } from "react";

type Point = { label: string; date: string; visits: number };
type Period = "month" | "year";
type ChartPoint = Point & { x: number; y: number };

const CHART_WIDTH = 900;
const CHART_HEIGHT = 300;
const PLOT_LEFT = 58;
const PLOT_RIGHT = 18;
const PLOT_TOP = 22;
const PLOT_BOTTOM = 42;
const PLOT_WIDTH = CHART_WIDTH - PLOT_LEFT - PLOT_RIGHT;
const PLOT_HEIGHT = CHART_HEIGHT - PLOT_TOP - PLOT_BOTTOM;

function niceMax(value: number) {
  if (value <= 5) return 5;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step = normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
}

function smoothPath(points: ChartPoint[]) {
  if (!points.length) return "";
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const before = points[index - 2] ?? previous;
    const after = points[index + 1] ?? point;
    const controlOneX = previous.x + (point.x - before.x) / 6;
    const controlOneY = previous.y + (point.y - before.y) / 6;
    const controlTwoX = point.x - (after.x - previous.x) / 6;
    const controlTwoY = point.y - (after.y - previous.y) / 6;
    return `${path} C ${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${point.x} ${point.y}`;
  }, "");
}

export function UserGrowthChart() {
  const now = new Date();
  const [period, setPeriod] = useState<Period>("year");
  const [year, setYear] = useState(now.getUTCFullYear());
  const [month, setMonth] = useState(now.getUTCMonth() + 1);
  const [points, setPoints] = useState<Point[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  function beginSelectionChange() {
    setLoading(true);
    setError("");
    setHoveredIndex(null);
  }

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
        if (!response.ok) {
          throw new Error(result.error ?? "Analytics could not be loaded.");
        }
        if (active) {
          setPoints(result.points ?? []);
          setTotal(result.total ?? 0);
        }
      })
      .catch((caught) => {
        if (active) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Analytics could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [month, period, year]);

  const scaleMax = niceMax(Math.max(...points.map((point) => point.visits), 1));
  const yTicks = Array.from({ length: 5 }, (_, index) =>
    Math.round((scaleMax / 4) * (4 - index)),
  );
  const chartPoints = useMemo<ChartPoint[]>(
    () =>
      points.map((point, index) => ({
        ...point,
        x:
          points.length === 1
            ? PLOT_LEFT + PLOT_WIDTH / 2
            : PLOT_LEFT + (index / (points.length - 1)) * PLOT_WIDTH,
        y:
          PLOT_TOP +
          PLOT_HEIGHT -
          (point.visits / scaleMax) * PLOT_HEIGHT,
      })),
    [points, scaleMax],
  );
  const linePath = smoothPath(chartPoints);
  const areaPath = chartPoints.length
    ? `${linePath} L ${chartPoints.at(-1)?.x ?? PLOT_LEFT} ${PLOT_TOP + PLOT_HEIGHT} L ${chartPoints[0].x} ${PLOT_TOP + PLOT_HEIGHT} Z`
    : "";
  const hoveredPoint =
    hoveredIndex === null ? null : chartPoints[hoveredIndex] ?? null;
  const periodLabel = period === "year" ? "year" : "month";

  return (
    <>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-[#ffd43b]/30 bg-black/30 p-1">
            {(["month", "year"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  beginSelectionChange();
                  setPeriod(value);
                }}
                className={`min-h-10 rounded-lg px-4 text-sm font-semibold capitalize transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b] motion-reduce:transition-none ${
                  period === value
                    ? "bg-[#ffd43b] text-black shadow-[0_0_18px_rgba(255,212,59,0.3)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          {period === "month" && (
            <select
              value={month}
              onChange={(event) => {
                beginSelectionChange();
                setMonth(Number(event.target.value));
              }}
              className="min-h-11 rounded-xl border border-white/15 bg-[#090909] px-3 text-sm text-white outline-none transition focus:border-[#ffd43b] focus:ring-2 focus:ring-[#ffd43b]/20"
              aria-label="Analytics month"
            >
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {new Intl.DateTimeFormat("en", { month: "long" }).format(
                    new Date(Date.UTC(2020, index, 1)),
                  )}
                </option>
              ))}
            </select>
          )}
          <select
            value={year}
            onChange={(event) => {
              beginSelectionChange();
              setYear(Number(event.target.value));
            }}
            className="min-h-11 rounded-xl border border-white/15 bg-[#090909] px-3 text-sm text-white outline-none transition focus:border-[#ffd43b] focus:ring-2 focus:ring-[#ffd43b]/20"
            aria-label="Analytics year"
          >
            {Array.from({ length: 5 }, (_, index) => {
              const value = now.getUTCFullYear() - index;
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex items-end gap-3">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
              Total visits
            </p>
            <p className="mb-0 text-3xl font-extrabold tracking-tight text-white tabular-nums">
              {loading ? "—" : total.toLocaleString()}
            </p>
          </div>
          <span className="mb-1 rounded-full border border-[#ffd43b]/25 bg-[#ffd43b]/10 px-2.5 py-1 text-xs font-semibold capitalize text-[#ffe49a]">
            This {periodLabel}
          </span>
        </div>
      </div>

      <div className="mt-7">
        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-16 text-center text-sm text-red-200"
          >
            {error}
          </p>
        ) : !loading && total === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-16 text-center text-sm text-gray-400">
            No visitor data yet
          </p>
        ) : (
          <div
            className={`relative overflow-x-auto rounded-xl border border-white/5 bg-black/20 p-2 transition-opacity duration-300 motion-reduce:transition-none ${
              loading ? "animate-pulse opacity-60 motion-reduce:animate-none" : "opacity-100"
            }`}
          >
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              className="h-[280px] min-w-[680px] w-full"
              role="img"
              aria-label={`${periodLabel} visitor growth chart`}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                <linearGradient id="visitor-area-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ffd43b" stopOpacity="0.34" />
                  <stop offset="75%" stopColor="#ffd43b" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ffd43b" stopOpacity="0" />
                </linearGradient>
                <filter id="visitor-point-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g aria-hidden="true">
                {yTicks.map((tick, index) => {
                  const y = PLOT_TOP + (index / 4) * PLOT_HEIGHT;
                  return (
                    <g key={tick}>
                      <line
                        x1={PLOT_LEFT}
                        x2={CHART_WIDTH - PLOT_RIGHT}
                        y1={y}
                        y2={y}
                        stroke="rgba(255,255,255,0.1)"
                        strokeDasharray={index === 4 ? undefined : "3 8"}
                      />
                      <text
                        x={PLOT_LEFT - 12}
                        y={y + 4}
                        textAnchor="end"
                        fill="#9ca3af"
                        fontSize="12"
                      >
                        {tick.toLocaleString()}
                      </text>
                    </g>
                  );
                })}
                <line
                  x1={PLOT_LEFT}
                  x2={CHART_WIDTH - PLOT_RIGHT}
                  y1={PLOT_TOP + PLOT_HEIGHT}
                  y2={PLOT_TOP + PLOT_HEIGHT}
                  stroke="rgba(255,212,59,0.25)"
                />
              </g>
              <path d={areaPath} fill="url(#visitor-area-fill)" className="transition-opacity duration-500 motion-reduce:transition-none" />
              <path
                d={linePath}
                fill="none"
                stroke="#ffd43b"
                strokeWidth="3.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#visitor-point-glow)"
                className="transition-all duration-500 motion-reduce:transition-none"
              />
              {chartPoints.map((point, index) => (
                <g key={point.date}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={hoveredIndex === index ? 8 : 5}
                    fill="#ffd43b"
                    stroke="#fff4bd"
                    strokeWidth={hoveredIndex === index ? 3 : 1.5}
                    filter="url(#visitor-point-glow)"
                    className="cursor-pointer transition-all duration-200 motion-reduce:transition-none"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onFocus={() => setHoveredIndex(index)}
                    tabIndex={0}
                    aria-label={`${point.label}: ${point.visits} visits`}
                  />
                  {(period === "year" || index % 5 === 0 || index === chartPoints.length - 1) && (
                    <text
                      x={point.x}
                      y={CHART_HEIGHT - 12}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="12"
                    >
                      {point.label}
                    </text>
                  )}
                </g>
              ))}
              {hoveredPoint && (
                <g pointerEvents="none">
                  <line
                    x1={hoveredPoint.x}
                    x2={hoveredPoint.x}
                    y1={PLOT_TOP}
                    y2={PLOT_TOP + PLOT_HEIGHT}
                    stroke="#ffd43b"
                    strokeOpacity="0.3"
                    strokeDasharray="4 5"
                  />
                  <rect
                    x={Math.min(Math.max(hoveredPoint.x - 62, PLOT_LEFT), CHART_WIDTH - 142)}
                    y={Math.max(hoveredPoint.y - 62, 2)}
                    width="124"
                    height="44"
                    rx="9"
                    fill="#17150d"
                    stroke="#ffd43b"
                    strokeOpacity="0.65"
                  />
                  <text
                    x={Math.min(Math.max(hoveredPoint.x, PLOT_LEFT + 62), CHART_WIDTH - 80)}
                    y={Math.max(hoveredPoint.y - 40, 22)}
                    textAnchor="middle"
                    fill="#ffe49a"
                    fontSize="11"
                  >
                    {hoveredPoint.label}
                  </text>
                  <text
                    x={Math.min(Math.max(hoveredPoint.x, PLOT_LEFT + 62), CHART_WIDTH - 80)}
                    y={Math.max(hoveredPoint.y - 23, 39)}
                    textAnchor="middle"
                    fill="white"
                    fontSize="13"
                    fontWeight="700"
                  >
                    {hoveredPoint.visits.toLocaleString()} visits
                  </text>
                </g>
              )}
            </svg>
          </div>
        )}
      </div>
    </>
  );
}
