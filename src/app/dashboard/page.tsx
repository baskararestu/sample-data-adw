"use client";

import { useState, useMemo, useEffect } from "react";
import { FilterBar } from "@/components/filter-bar";
import { ComplaintChartBarWeekly } from "@/components/complaint-chart-bar-weekly";
import { ComplaintChartBarPICPerformance } from "@/components/complain-chart-bar-pic-performance";
import { TransformedChartData } from "@/types/chart-types";
import { ComplaintChartPieDonutWeekly } from "@/components/complaint-chart-pie-donut-weekly";

type ChartRow = {
  week: string;
  [picKey: string]: number | string;
};

export default function DashboardPage() {
  const [area, setArea] = useState("");
  const [selectedPIC, setSelectedPIC] = useState("");
  const [data, setData] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(true);

  const allAvailablePics = useMemo(() => {
    return ["Galih Nurdiansyah", "Sinta Lestari", "Deni Kurniawan", "Bima Ramadhan", "Maria Fransisca", "Aldi Suryana", "Farah Annisa", "Wahyu Hidayat", "Shinta Wahyuni"].sort();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        area,
        pic: selectedPIC,
        weekly: "true",
      });
      const res = await fetch(`/api/complaints?${params.toString()}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    fetchData();
  }, [area, selectedPIC]);

  const processedChartData = useMemo(() => {
    if (loading)
      return {
        chartData: [],
        picNames: [],
        totalComplaintsDuration: 0,
        picPerformanceData: [],
      };

    const picKeysInChart = new Set<string>();
    let totalDurationSum = 0;

    const chartDataWeekly = data.map((row) => {
      const { week, ...others } = row;
      const formattedWeekLabel = formatWeekLabel(week);
      const chartRow: TransformedChartData = { date: formattedWeekLabel };

      Object.entries(others).forEach(([picKey, duration]) => {
        chartRow[picKey] = duration;
        picKeysInChart.add(picKey);
        totalDurationSum += Number(duration);
      });

      return chartRow;
    });

    chartDataWeekly.sort((a, b) => {
      const parseLabelForSort = (label: string) => {
        const [startPart] = label.split(" s.d. ");
        const [day, month] = startPart.split("-").map(Number);
        return new Date(2025, month - 1, day).getTime();
      };
      const dateA = parseLabelForSort(a.date as string);
      const dateB = parseLabelForSort(b.date as string);
      return dateA - dateB;
    });

    const picTotalDurations: { [key: string]: number } = {};

    data.forEach((row) => {
      Object.entries(row).forEach(([key, value]) => {
        if (key !== "week" && typeof value === "number") {
          picTotalDurations[key] = (picTotalDurations[key] || 0) + value;
        }
      });
    });

    let picPerformanceData = Object.entries(picTotalDurations).map(([picKey, totalDuration]) => ({
      picName: allAvailablePics.find((name) => name.replace(/\s/g, "_").toLowerCase() === picKey) || picKey,
      totalDuration: totalDuration,
    }));

    if (selectedPIC !== "All") {
      picPerformanceData = picPerformanceData.filter((item) => item.picName === selectedPIC);
    }

    picPerformanceData.sort((a, b) => a.totalDuration - b.totalDuration);

    return {
      chartData: chartDataWeekly,
      picNames: Array.from(picKeysInChart),
      totalComplaintsDuration: totalDurationSum,
      picPerformanceData: picPerformanceData,
    };
  }, [data, loading, selectedPIC, allAvailablePics]);

  return (
    <div className="p-4 space-y-6">
      <FilterBar area={area} setArea={setArea} selectedPIC={selectedPIC} setSelectedPIC={setSelectedPIC} />
      <ComplaintChartBarWeekly data={processedChartData.chartData} picNames={processedChartData.picNames} totalComplaintsDuration={processedChartData.totalComplaintsDuration} />
      <ComplaintChartPieDonutWeekly picPerformanceData={processedChartData.picPerformanceData} />
      <ComplaintChartBarPICPerformance data={processedChartData.picPerformanceData} allPicNames={allAvailablePics} />
    </div>
  );
}

function formatWeekLabel(label: string) {
  const [start, end] = label.split("_to_");
  const [m1, d1] = start.split("-");
  const [m2, d2] = end.split("-");
  return `${d1}-${m1} s.d. ${d2}-${m2}`;
}
