"use client";

import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, CartesianGrid, LabelList, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TransformedChartData } from "@/types/chart-types";

type Props = {
  data: TransformedChartData[];
  picNames: string[];
  totalComplaintsDuration: number;
};

export function ComplaintChartLineWeekly({ data, picNames, totalComplaintsDuration }: Props) {
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

  const chartConfig: ChartConfig = picNames.reduce((acc, picKey) => {
    const label = picKey.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
    acc[picKey] = {
      label,
      color: colorMap[label] || "#8884d8",
    };
    return acc;
  }, {} as ChartConfig);

  const totalChartDuration = data.reduce((sum, entry) => {
    return (
      sum +
      Object.entries(entry).reduce((sub, [key, val]) => {
        if (key !== "date" && typeof val === "number") sub += val;
        return sub;
      }, 0)
    );
  }, 0);

  const firstWeekLabel = data.length > 0 ? data[0].date : "N/A";
  const lastWeekLabel = data.length > 0 ? data[data.length - 1].date : "N/A";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Durasi Komplain per PIC per Minggu</CardTitle>
        <CardDescription>Line chart menampilkan tren durasi penanganan komplain mingguan berdasarkan PIC.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Legend />
              {picNames.map((picKey) => (
                <Line key={picKey} dataKey={picKey} type="monotone" stroke={`var(--color-${picKey})`} strokeWidth={2} dot={{ fill: `var(--color-${picKey})` }} activeDot={{ r: 6 }}>
                  <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                </Line>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total Durasi Komplain Keseluruhan: **{totalChartDuration.toFixed(2)} jam**
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-muted-foreground leading-none">Total dari Data Filter: **{totalComplaintsDuration.toFixed(2)} jam**</div>
        <div className="text-muted-foreground leading-none">
          Periode Data: **{firstWeekLabel}** hingga **{lastWeekLabel}**
        </div>
      </CardFooter>
    </Card>
  );
}
