import { NextResponse } from "next/server";
import {
  getContent,
  getPageContent,
  PAGE_META,
  resetContentSection,
  saveContentSection,
} from "@/lib/cms";

export async function GET(request) {
  const section = request.nextUrl.searchParams.get("section");
  if (section) {
    const data = await getPageContent(section);
    if (!data) {
      return NextResponse.json({ error: "Unknown section" }, { status: 404 });
    }
    return NextResponse.json({
      section,
      meta: PAGE_META.find((p) => p.id === section) || null,
      data,
    });
  }
  const content = await getContent();
  return NextResponse.json({
    meta: PAGE_META,
    updatedAt: content.updatedAt || null,
    sections: PAGE_META.map((p) => p.id),
  });
}

export async function PUT(request) {
  const body = await request.json().catch(() => null);
  if (!body?.section || body.data == null) {
    return NextResponse.json(
      { error: "section and data are required" },
      { status: 400 }
    );
  }
  if (!PAGE_META.some((p) => p.id === body.section)) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }
  await saveContentSection(body.section, body.data);
  return NextResponse.json({ ok: true, section: body.section });
}

export async function DELETE(request) {
  const section = request.nextUrl.searchParams.get("section");
  if (!section || !PAGE_META.some((p) => p.id === section)) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }
  await resetContentSection(section);
  return NextResponse.json({ ok: true, section });
}
