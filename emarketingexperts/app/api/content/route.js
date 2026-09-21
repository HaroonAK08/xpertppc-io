import { NextResponse } from "next/server";
import { getPageContent, PAGE_META } from "@/lib/cms";

export async function GET(request) {
  const section = request.nextUrl.searchParams.get("section") || "site";
  if (!PAGE_META.some((p) => p.id === section)) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }
  const data = await getPageContent(section);
  return NextResponse.json({ section, data });
}
