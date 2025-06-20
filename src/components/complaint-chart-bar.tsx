"use client";

import { TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type TransformedChartData = {
  date: string;
  [picKey: string]: number | string;
};

type Props = {
  data: TransformedChartData[];
  picNames: string[];
  totalComplaints: number;
};

export function ComplaintChartBar({ data, picNames, totalComplaints }: Props) {
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
    acc[picKey] = {
      label: picKey.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase()),
      color: barColors[picKey.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())] || "#8884d8",
    };
    return acc;
  }, {});

  const totalComplaintDuration = data.reduce((sum, entry) => {
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
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value: string) => value} />
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
                return <Bar key={picKey} dataKey={picKey} fill={`var(--color-${picKey})`} radius={8} />;
              })}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total Durasi Komplain Keseluruhan: **{totalComplaintDuration.toFixed(2)} jam**
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-muted-foreground leading-none">Jumlah Total Durasi Komplain (Agregasi Mingguan): **{totalComplaints.toFixed(2)} jam**</div> {/* totalComplaints di sini adalah total durasi */}
        <div className="text-muted-foreground leading-none">
          Periode Data: **{firstWeekLabel}** hingga **{lastWeekLabel}**
        </div>
      </CardFooter>
    </Card>
  );
}
