import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";
import { readStage, STORY_COOKIE } from "@/lib/storyAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const photoRoot = path.resolve(process.cwd(), "private", "images");
const groups = new Set(["hero", "story", "journey", "memories", "reasons", "ending"]);
const photoAssetPrefix = "/_private-story-images/";

type AssetFetcher = { fetch(request: Request): Promise<Response> };

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  if (readStage(request.cookies.get(STORY_COOKIE)?.value) !== 2) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  const segments = (await params).path;
  if (segments.length !== 2 || !groups.has(segments[0]) || !/^[a-z0-9-]+\.webp$/.test(segments[1])) return new Response(null, { status: 404 });
  try {
    let body: BodyInit;
    let assets: AssetFetcher | undefined;
    try {
      assets = (getCloudflareContext().env as unknown as { ASSETS?: AssetFetcher }).ASSETS;
    } catch {
      // A Node.js server has no Cloudflare context; use the local private files.
    }
    if (!assets) {
      const bytes = await readFile(path.join(photoRoot, segments[0], segments[1]));
      body = new Uint8Array(bytes);
    } else {
      const assetUrl = new URL(`${photoAssetPrefix}${segments[0]}/${segments[1]}`, request.url);
      const assetResponse = await assets.fetch(new Request(assetUrl));
      if (!assetResponse.ok || !assetResponse.body) return new Response(null, { status: 404 });
      body = assetResponse.body;
    }
    return new Response(body, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
