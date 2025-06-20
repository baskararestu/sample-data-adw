"use client";

import { TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TransformedChartData } from "@/types/chart-types";

type Props = {
  data: TransformedChartData[];
  picNames: string[];
  totalComplaintsDuration: number;
};

export function ComplaintChartBarWeekly({ data, picNames, totalComplaintsDuration }: Props) {
  const barColors: { [key: string]: string } = {
    "Galih Nurdiansyah": "#2563eb",
    "Sinta Lestari": "#82ca9d",
    "Deni Kurniawan": "#ffc658",
    "Bima Ramadhan": "#ef4444",
    "Maria Fransisca": "#a855f7",
    "Aldi Suryana": "#f97316",
    "Farah Annisa": "#14b8a6",
    "Wahyu Hidayat": "#eab308",
    "Shinta Wahyuni": "#be185d",
  };

  const chartConfig: ChartConfig = picNames.reduce((acc: ChartConfig, picKey) => {
    const originalPicName = picKey.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
    acc[picKey] = {
      label: originalPicName,
      color: barColors[originalPicName] || "#8884d8",
    };
    return acc;
  }, {});

  const totalChartDuration = data.reduce((sum, entry) => {
    let entryTotal = 0;
    for (const key in entry) {
      if (key !== "date" && typeof entry[key] === "number") {
        entryTotal += entry[key] as number;
      }
    }
    return sum + entryTotal;
  }, 0);

  const firstWeekLabel = data.length > 0 ? data[0].date : "N/A";
  const lastWeekLabel = data.length > 0 ? data[data.length - 1].date : "N/A";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Durasi Komplain per PIC per Minggu</CardTitle>
        <CardDescription>Grafik ini menampilkan total durasi komplain dalam jam, dikategorikan berdasarkan Petugas Penanganan Komplain (PIC) dan dipecah berdasarkan periode mingguan. Ini membantu memvisualisasikan distribusi beban kerja dan tren penyelesaian.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => {
                      const numericValue = typeof value === "number" ? value : parseFloat(value as string);
                      const displayLabel = chartConfig[name]?.label || name;
                      return [`${numericValue.toFixed(2)} jam`, displayLabel];
                    }}
                  />
                }
              />
              <Legend />
              {picNames.map((picKey) => {
                return <Bar key={picKey} dataKey={picKey} stackId="a" fill={`var(--color-${picKey})`} radius={8} />;
              })}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total Durasi Komplain Keseluruhan: **{totalChartDuration.toFixed(2)} jam**
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-muted-foreground leading-none">Total Durasi Komplain dari Data Filter: **{totalComplaintsDuration.toFixed(2)} jam**</div>
        <div className="text-muted-foreground leading-none">
          Periode Data: **{firstWeekLabel}** hingga **{lastWeekLabel}**
        </div>
      </CardFooter>
    </Card>
  );
}
