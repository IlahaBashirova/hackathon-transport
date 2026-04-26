import { NextResponse } from "next/server";
import { extractEventData } from "@/lib/ai";

export async function POST(request: Request) {
  const body = (await request.json()) as { rawText?: string };
  const rawText = body.rawText?.trim();

  if (!rawText) {
    return NextResponse.json(
      { error: "rawText is required for event extraction." },
      { status: 400 },
    );
  }

  const event = await extractEventData({ rawText });

  return NextResponse.json({ event });
}
