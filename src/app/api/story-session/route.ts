import { NextRequest, NextResponse } from "next/server";
import { answerMatches, createSession, readStage, sessionMaxAge, STORY_COOKIE } from "@/lib/storyAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const attempts = new Map<string, { count: number; until: number }>();
const windowMs = 15 * 60 * 1000;

function attemptKey(request: NextRequest) {
  return request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "local";
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

export function GET(request: NextRequest) {
  return NextResponse.json({ stage: readStage(request.cookies.get(STORY_COOKIE)?.value) }, { headers: noStore });
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: noStore });
  const stage = readStage(request.cookies.get(STORY_COOKIE)?.value);
  if (stage === 2) return NextResponse.json({ stage }, { headers: noStore });
  const key = attemptKey(request);
  const now = Date.now();
  const record = attempts.get(key);
  if (record && record.until > now && record.count >= 8) {
    return NextResponse.json({ error: "Please wait before trying again." }, { status: 429, headers: { ...noStore, "Retry-After": String(Math.ceil((record.until - now) / 1000)) } });
  }
  let answer = "";
  try { answer = (await request.json()).answer; } catch { /* malformed input */ }
  if (typeof answer !== "string" || !answerMatches(stage, answer)) {
    attempts.set(key, { count: record && record.until > now ? record.count + 1 : 1, until: record && record.until > now ? record.until : now + windowMs });
    return NextResponse.json({ stage, correct: false }, { status: 401, headers: noStore });
  }
  attempts.delete(key);
  const nextStage = stage + 1;
  const response = NextResponse.json({ stage: nextStage, correct: true }, { headers: noStore });
  response.cookies.set(STORY_COOKIE, createSession(nextStage), {
    httpOnly: true, secure: request.nextUrl.protocol === "https:", sameSite: "strict", path: "/", maxAge: sessionMaxAge,
  });
  return response;
}

export function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: noStore });
  const response = NextResponse.json({ stage: 0 }, { headers: noStore });
  response.cookies.delete(STORY_COOKIE);
  return response;
}
