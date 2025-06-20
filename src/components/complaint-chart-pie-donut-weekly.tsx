"use client";

import { TrendingUp } from "lucide-react";
import { PieChart, Pie, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type PieDataItem = {
  picKey: string;
  duration: number;
  fill: string;
};

type Props = {
  picPerformanceData: {
    picName: string;
    totalDuration: number;
  }[];
  allPicNames: string[];
};

export function ComplaintChartPieDonutWeekly({ picPerformanceData, allPicNames }: Props) {
  const colorMap: Record<string, string> = {
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

  const chartData: PieDataItem[] = picPerformanceData.map((item) => ({
    picKey: item.picName,
    duration: item.totalDuration,
    fill: colorMap[item.picName] || "#8884d8",
  }));

  const activeIndex = chartData.reduce((maxIdx, item, idx, arr) => (item.duration > arr[maxIdx].duration ? idx : maxIdx), 0);

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.picKey] = {
      label: item.picKey,
      color: item.fill,
    };
    return acc;
  }, {} as any);

  const totalDuration = chartData.reduce((sum, item) => sum + item.duration, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Distribusi Durasi Komplain</CardTitle>
        <CardDescription>Proporsi total durasi penanganan komplain oleh masing-masing PIC.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel={false}
                  formatter={(value, name) => {
                    const numericValue = typeof value === "number" ? value : parseFloat(String(value));
                    return [`${numericValue.toFixed(2)} jam`, name];
                  }}
                />
              }
            />
            <Pie data={chartData} dataKey="duration" nameKey="picKey" innerRadius={60} strokeWidth={5} activeIndex={activeIndex} activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => <Sector {...props} outerRadius={outerRadius + 8} />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Durasi Komplain: {totalDuration.toFixed(2)} jam
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-muted-foreground leading-none">Menampilkan distribusi PIC aktif</div>
      </CardFooter>
    </Card>
  );
}
