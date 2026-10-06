import { NextResponse } from "next/server";

// Private photos are fetched internally through the ASSETS binding after the
// story session has been checked by /api/story-photo.
export function proxy() {
  return new NextResponse(null, {
    status: 404,
    headers: { "Cache-Control": "no-store" },
  });
}

export const config = {
  matcher: "/_private-story-images/:path*",
};
