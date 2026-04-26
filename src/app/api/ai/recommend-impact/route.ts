import { NextResponse } from "next/server";
import { recommendTransportImpact } from "@/lib/ai";
import {
  ExtractedEventData,
  PredictionEngineResult,
} from "@/lib/ai/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    event?: ExtractedEventData;
    prediction?: PredictionEngineResult;
  };

  if (!body.event || !body.prediction) {
    return NextResponse.json(
      { error: "event and prediction are required for recommendations." },
      { status: 400 },
    );
  }

  const recommendation = await recommendTransportImpact({
    event: body.event,
    prediction: body.prediction,
  });

  return NextResponse.json({ recommendation });
}
