"use client";

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type DataItem = {
  lama_jam: number;
};

type InputData = {
  date: string;
  data: DataItem[];
};

type Props = {
  data: InputData[];
};

export function ComplaintChartLine({ data }: Props) {
  const transformed = data.map((entry) => {
    const total = entry.data.reduce((sum, item) => sum + item.lama_jam, 0);
    return {
      date: entry.date,
      total_duration: total,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Durasi Keluhan (jam)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={transformed}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <Tooltip />
            <Area type="monotone" dataKey="total_duration" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
