"use client";

import { TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type PICPerformanceData = {
  picName: string;
  totalDuration: number;
};

type Props = {
  data: PICPerformanceData[];
  allPicNames: string[];
};

export function ComplaintChartBarPICPerformance({ data, allPicNames }: Props) {
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

  const chartData = data.map((item) => ({
    ...item,
    fill: barColors[item.picName] || "#8884d8",
  }));

  const chartConfig: ChartConfig = allPicNames.reduce(
    (acc: ChartConfig, picName) => {
      const sanitized = picName.replace(/\s/g, "_").toLowerCase();
      acc[sanitized] = {
        label: picName,
        color: barColors[picName] || "#8884d8",
      };
      return acc;
    },
    {
      totalDuration: {
        label: "Total Durasi",
      },
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performa Durasi Komplain per PIC</CardTitle>
        <CardDescription>Total durasi komplain yang ditangani oleh setiap PIC dalam periode yang difilter, diurutkan dari yang terendah.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 0 }}>
            <YAxis dataKey="picName" type="category" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => chartConfig[value.replace(/\s/g, "_").toLowerCase()]?.label || value} />
            <XAxis dataKey="totalDuration" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel formatter={(value) => [`${Number(value).toFixed(2)} jam`, "Durasi"]} />} />
            <Bar dataKey="totalDuration" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Improving response time <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">Berdasarkan data durasi komplain selama periode tertentu</div>
      </CardFooter>
    </Card>
  );
}
