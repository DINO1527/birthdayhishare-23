import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const STORY_COOKIE = "birthday_story_session";
const lifetime = 60 * 60 * 24 * 7;
const answers = [process.env.STORY_ANSWER_1, process.env.STORY_ANSWER_2];

function secret() {
  const value = process.env.STORY_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("Set STORY_SESSION_SECRET to a random value of at least 32 characters.");
  return value;
}

export function normalizeAnswer(value: string) {
  return value.normalize("NFKC").trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

export function answerMatches(stage: number, answer: string) {
  const expected = answers[stage];
  if (!expected || answer.length > 120) return false;
  const received = createHmac("sha256", secret()).update(normalizeAnswer(answer)).digest();
  const known = createHmac("sha256", secret()).update(normalizeAnswer(expected)).digest();
  return timingSafeEqual(received, known);
}

export function createSession(stage: number) {
  const payload = `${stage}.${Math.floor(Date.now() / 1000) + lifetime}`;
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function readStage(cookie?: string) {
  if (!cookie) return 0;
  const [rawStage, rawExpiry, signature] = cookie.split(".");
  const stage = Number(rawStage);
  const expiry = Number(rawExpiry);
  if (!Number.isInteger(stage) || stage < 1 || stage > 2 || !Number.isSafeInteger(expiry) || expiry < Date.now() / 1000 || !signature) return 0;
  const expected = createHmac("sha256", secret()).update(`${rawStage}.${rawExpiry}`).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b) ? stage : 0;
}

export const sessionMaxAge = lifetime;
