import { NextResponse } from "next/server";
import { normalizeLocale } from "@/lib/i18n";
import { translateMany } from "@/lib/translation";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    targetLocale?: string;
    texts?: string[];
  };

  const locale = normalizeLocale(body.targetLocale);
  const texts = Array.isArray(body.texts) ? body.texts.filter((entry): entry is string => typeof entry === "string") : [];

  if (!locale || texts.length === 0) {
    return NextResponse.json({ message: "Invalid translation payload." }, { status: 400 });
  }

  const translated = await translateMany(texts, locale);

  return NextResponse.json({ locale, translated });
}