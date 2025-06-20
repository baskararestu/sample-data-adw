import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { startOfWeek, endOfWeek } from "date-fns";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { area, pic, weekly } = Object.fromEntries(new URL(req.url).searchParams);

  const where: any = {};
  if (area && area !== "All") where.area = area;
  if (pic && pic !== "All") where.picHandlingComplain = pic;

  // Untuk debugging
  console.log("Backend filter where:", where);

  const items = await prisma.complaint.findMany({ where });

  if (weekly === "true") {
    const grouped: Record<string, any[]> = {};
    items.forEach((c) => {
      const start = startOfWeek(c.timeStartComplain, { weekStartsOn: 1 });
      const end = endOfWeek(c.timeStartComplain, { weekStartsOn: 1 });
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
