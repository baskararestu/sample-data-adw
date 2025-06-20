import { NextResponse } from "next/server";

export async function GETDummy() {
  const dummy = await import("@/data/complaint-dummy.json");
  return NextResponse.json(dummy.default);
}
