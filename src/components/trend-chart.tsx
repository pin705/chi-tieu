import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { formatCurrency } from "utils/format";

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface TrendChartProps {
  data: DataPoint[];
  maxValue?: number;
  height?: number;
  showValues?: boolean;
  type?: "bar" | "line";
}

export const TrendChart: FC<TrendChartProps> = ({
  data,
  maxValue,
  height = 200,
  showValues = true,
  type = "bar",
}) => {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  if (type === "line") {
    // Line chart implementation
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.value / max) * 100;
      return `${x}% ${y}%`;
    });

    return (
      <Box className="w-full" style={{ height: `${height}px` }}>
        <Box className="relative w-full h-full">
          {/* SVG Line Chart */}
          <svg className="w-full h-full" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0%"
                y1={`${y}%`}
                x2="100%"
                y2={`${y}%`}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            ))}
            
            {/* Line path */}
            <polyline
              points={points.join(", ")}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = 100 - (d.value / max) * 100;
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill={d.color || "#3B82F6"}
                />
              );
            })}
          </svg>

          {/* Labels */}
          <Box className="flex justify-between mt-2">
            {data.map((d, i) => (
              <Box key={i} className="text-center" style={{ flex: 1 }}>
                <Text size="xSmall" className="text-gray-600">
                  {d.label}
                </Text>
                {showValues && (
                  <Text size="xSmall" className="font-medium mt-1">
                    {formatCurrency(d.value)}
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  // Bar chart implementation (default)
  return (
    <Box className="w-full">
      <Box className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
        {data.map((d, i) => {
          const heightPercent = max > 0 ? (d.value / max) * 100 : 0;
          return (
            <Box key={i} className="flex-1 flex flex-col items-center justify-end">
              <Box
                className="w-full rounded-t transition-all duration-300"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: d.color || "#3B82F6",
                  minHeight: d.value > 0 ? "4px" : "0px",
                }}
              />
            </Box>
          );
        })}
      </Box>
      <Box className="flex justify-between gap-2 mt-2">
        {data.map((d, i) => (
          <Box key={i} className="flex-1 text-center">
            <Text size="xSmall" className="text-gray-600 block">
              {d.label}
            </Text>
            {showValues && (
              <Text size="xSmall" className="font-medium block mt-1">
                {formatCurrency(d.value)}
              </Text>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
