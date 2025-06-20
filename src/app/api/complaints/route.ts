import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { startOfWeek, endOfWeek, parse } from "date-fns";
import complaintDummy from "@/data/complaint-dummy.json";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { area, pic, weekly } = Object.fromEntries(new URL(req.url).searchParams);

  const where: any = {};
  if (area && area !== "All") where.area = area;
  if (pic && pic !== "All") where.picHandlingComplain = pic;

  console.log("Backend filter where:", where);

  let items: any[] = [];

  try {
    items = await prisma.complaint.findMany({ where });
  } catch (error) {
    console.error("❌ Gagal koneksi ke database, fallback ke dummy:", error);
    items = complaintDummy.map((item: any) => ({
      ...item,
      timeStartComplain: parse(item.timeStartComplain, "dd-MM-yyyy HH:mm", new Date()),
      timeCloseComplain: parse(item.timeCloseComplain, "dd-MM-yyyy HH:mm", new Date()),
    }));

    items = items.filter((item) => {
      const matchArea = !where.area || item.area === where.area;
      const matchPIC = !where.picHandlingComplain || item.picHandlingComplain === where.picHandlingComplain;
      return matchArea && matchPIC;
    });
  }

  if (weekly === "true") {
    const grouped: Record<string, any[]> = {};
    items.forEach((c) => {
      const start = startOfWeek(new Date(c.timeStartComplain), { weekStartsOn: 1 });
      const end = endOfWeek(new Date(c.timeStartComplain), { weekStartsOn: 1 });
      const label = `${start.toISOString().slice(0, 10)}_to_${end.toISOString().slice(0, 10)}`;
      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(c);
    });

    const result = Object.entries(grouped).map(([week, arr]) => {
      const aggregated: any = { week };
      arr.forEach((c) => {
        const key = c.picHandlingComplain.replace(/\s/g, "_").toLowerCase();
        aggregated[key] = (aggregated[key] || 0) + c.complaintDurationHours;
      });
      return aggregated;
    });

    return NextResponse.json(result);
  }

  return NextResponse.json(items);
}
