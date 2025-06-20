import { NextResponse } from "next/server";
import { startOfWeek, endOfWeek, parse } from "date-fns";
import complaintDummy from "@/data/complaint-dummy.json";

type Complaint = {
  area: string;
  picHandlingComplain: string;
  complaintDurationHours: number;
  timeStartComplain: Date;
  timeCloseComplain: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type ComplaintDummyItem = Omit<Complaint, "timeStartComplain" | "timeCloseComplain"> & {
  timeStartComplain: string;
  timeCloseComplain: string;
};

export async function GET(req: Request) {
  const { area, pic, weekly } = Object.fromEntries(new URL(req.url).searchParams);

  const where: Record<string, string> = {};
  if (area && area !== "All") where.area = area;
  if (pic && pic !== "All") where.picHandlingComplain = pic;

  let items: Complaint[] = (complaintDummy as ComplaintDummyItem[]).map(
    (item) =>
      ({
        ...item,
        timeStartComplain: parse(item.timeStartComplain, "dd-MM-yyyy HH:mm", new Date()),
        timeCloseComplain: parse(item.timeCloseComplain, "dd-MM-yyyy HH:mm", new Date()),
      } as Complaint)
  );

  items = items.filter((item) => {
    const matchArea = !where.area || item.area === where.area;
    const matchPIC = !where.picHandlingComplain || item.picHandlingComplain === where.picHandlingComplain;
    return matchArea && matchPIC;
  });

  if (weekly === "true") {
    const grouped: Record<string, Complaint[]> = {};
    items.forEach((c) => {
      const start = startOfWeek(new Date(c.timeStartComplain), { weekStartsOn: 1 });
      const end = endOfWeek(new Date(c.timeStartComplain), { weekStartsOn: 1 });
      const label = `${start.toISOString().slice(0, 10)}_to_${end.toISOString().slice(0, 10)}`;
      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(c);
    });

    const result = Object.entries(grouped).map(([week, arr]) => {
      const aggregated: Record<string, number | string> = { week };
      arr.forEach((c) => {
        const key = c.picHandlingComplain.replace(/\s/g, "_").toLowerCase();
        aggregated[key] = ((aggregated[key] || 0) as number) + c.complaintDurationHours;
      });
      return aggregated;
    });

    return NextResponse.json(result);
  }

  return NextResponse.json(items);
}
