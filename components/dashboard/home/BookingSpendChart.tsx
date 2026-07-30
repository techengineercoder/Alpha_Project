"use client";

import React, { useState } from "react";

export function BookingSpendChart() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const points = [
    { label: "Jan", val: "$200K", x: 70, y: 192 },
    { label: "Feb", val: "$340K", x: 180, y: 154 },
    { label: "Mar", val: "$180K", x: 290, y: 198 },
    { label: "Apr", val: "$500K", x: 400, y: 111 },
    { label: "May", val: "$380K", x: 510, y: 143 },
    { label: "Jun", val: "$540K", x: 620, y: 100 },
    { label: "Jul", val: "$600K", x: 730, y: 84 }
  ];

  const gridLevels = [
    { label: "$800K", y: 30 },
    { label: "$600K", y: 84 },
    { label: "$400K", y: 138 },
    { label: "$200K", y: 192 },
    { label: "$0K", y: 245 }
  ];

  return (
    <div 
      className="border-[1.24px] border-white/[0.05] hover:border-white/10 rounded-[24.71px] p-4 sm:p-[24.71px] transition-all flex flex-col justify-between h-[320px] sm:h-[390px] shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.04)"
      }}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Booking Spend</h2>
          <p className="text-xs text-zinc-500 font-semibold mt-0.5">Booked vs pipeline spend, 2025</p>
        </div>
        
        {/* Legends */}
        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00A5E5]" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            <span>Pipeline</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="flex-1 w-full relative min-h-0">
        <svg viewBox="0 0 800 270" className="w-full h-full select-none" preserveAspectRatio="none">
          {/* Grid lines */}
          {gridLevels.map((lvl) => (
            <g key={lvl.label}>
              <line
                x1="60"
                y1={lvl.y}
                x2="750"
                y2={lvl.y}
                stroke="white"
                strokeOpacity="0.03"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text x="15" y={lvl.y + 4} fill="#52525b" fontSize="11" fontWeight="600" className="font-sans">
                {lvl.label}
              </text>
            </g>
          ))}

          {/* Smooth Bezier Spline - Solid Part (Jan to May) */}
          <path
            d="M 70,192 C 120,180 130,154 180,154 C 230,154 240,198 290,198 C 340,198 350,111 400,111 C 450,111 460,143 510,143"
            fill="none"
            stroke="#00A5E5"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Smooth Bezier Spline - Dashed Part (May to Jul) */}
          <path
            d="M 510,143 C 560,143 570,100 620,100 C 670,100 685,84 730,84"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="5 4"
          />

          {/* Active hover vertical lines */}
          {hoveredPoint !== null && (
            <line
              x1={points[hoveredPoint].x}
              y1="30"
              x2={points[hoveredPoint].x}
              y2="245"
              stroke="white"
              strokeOpacity="0.08"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          )}

          {/* X Axis Labels */}
          {points.map((pt) => (
            <text key={pt.label} x={pt.x} y="265" textAnchor="middle" fill="#52525b" fontSize="11" fontWeight="600" className="font-sans">
              {pt.label}
            </text>
          ))}

          {/* Render Active Hover Dot */}
          {hoveredPoint !== null && (
            <g>
              <circle
                cx={points[hoveredPoint].x}
                cy={points[hoveredPoint].y}
                r="10"
                fill={hoveredPoint >= 4 ? "#3B82F6" : "#00A5E5"}
                fillOpacity="0.25"
              />
              <circle
                cx={points[hoveredPoint].x}
                cy={points[hoveredPoint].y}
                r="4.5"
                fill="#ffffff"
                stroke={hoveredPoint >= 4 ? "#3B82F6" : "#00A5E5"}
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Transparent Hover Detection rects (one per column) */}
          {points.map((pt, idx) => (
            <rect
              key={`detect-${idx}`}
              x={pt.x - 45}
              y="20"
              width="90"
              height="230"
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(idx)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {/* HTML Tooltip on hover */}
        {hoveredPoint !== null && (
          <div
            className="absolute bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-bold shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full flex flex-col gap-0.5 z-20"
            style={{
              left: `${(points[hoveredPoint].x / 800) * 100}%`,
              top: `${(points[hoveredPoint].y / 270) * 100 - 4}%`
            }}
          >
            <span className="text-[10px] text-zinc-500 font-semibold">{points[hoveredPoint].label} 2025</span>
            <span className={`${hoveredPoint >= 4 ? "text-[#3B82F6]" : "text-[#00A5E5]"} font-extrabold text-sm`}>
              {points[hoveredPoint].val}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
