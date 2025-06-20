import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import dataDummy from "../src/data/complaint-dummy.json";

const prisma = new PrismaClient();

function parseDateTime(s: string): Date {
  return DateTime.fromFormat(s, "dd-MM-yyyy HH:mm").toJSDate();
}

async function main() {
  await prisma.complaint.deleteMany({}); // clear existing
  const transformedData = dataDummy.map((entry) => ({
    ...entry,
    timeStartComplain: parseDateTime(entry.timeStartComplain),
    timeCloseComplain: parseDateTime(entry.timeCloseComplain),
  }));

  await prisma.complaint.createMany({ data: transformedData });
  console.log("✅ Seed done");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
