"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface Props {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
}

export default function LeetCodeRing({
  totalSolved,
  easy,
  medium,
  hard,
}: Props) {

  const data = [
    { name: "Easy", value: easy, fill: "#22c55e" },
    { name: "Medium", value: medium, fill: "#eab308" },
    { name: "Hard", value: hard, fill: "#ef4444" },
  ];

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-xl h-[350px]">
      <div className="relative w-full h-[250px]">
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="50%"
            outerRadius="100%"
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar dataKey="value" />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">{totalSolved}</h1>
          <p className="text-gray-400 text-sm">Solved</p>
        </div>
      </div>
    </div>
  );
}
