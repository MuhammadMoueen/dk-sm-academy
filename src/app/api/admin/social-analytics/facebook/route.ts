import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireApiAdmin } from "@/lib/admin-api";
import {
  deleteConnection,
  decryptSecret,
  saveConnection,
} from "@/features/social-analytics/social-analytics";

type PendingFacebook = { provider: "facebook"; userAccessToken: string };

async function facebookJson(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok) throw new Error("Facebook authorization request failed.");
  return body ?? {};
}

async function getPendingPages() {
  const cookieStore = await cookies();
  const value = cookieStore.get("social_oauth_facebook_pending")?.value;
  if (!value) return null;

  const pending = JSON.parse(decryptSecret(value)) as PendingFacebook;
  if (pending.provider !== "facebook" || !pending.userAccessToken) return null;

  const body = await facebookJson(
    "https://graph.facebook.com/v23.0/me/accounts?fields=id,name,access_token",
    { headers: { Authorization: `Bearer ${pending.userAccessToken}` } },
  );
  const pages = Array.isArray(body.data)
    ? body.data
      .map((entry) => entry as Record<string, unknown>)
      .filter((entry) => typeof entry.id === "string" && typeof entry.name === "string")
      .map((entry) => ({ id: entry.id as string, name: entry.name as string }))
    : [];

  return { pending, pages };
}

export async function GET(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const result = await getPendingPages();
    return NextResponse.json({ pages: result?.pages ?? [] });
  } catch {
    return NextResponse.json(
      { error: "Facebook Pages could not be loaded." },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid Page selection." }, { status: 400 });
  }
  const pageId = typeof body === "object" && body !== null && "pageId" in body
    ? (body as { pageId?: unknown }).pageId
    : undefined;
  if (typeof pageId !== "string" || !pageId) {
    return NextResponse.json({ error: "Select a Facebook Page." }, { status: 400 });
  }

  try {
    const result = await getPendingPages();
    const page = result?.pages.find((entry) => entry.id === pageId);
    if (!result || !page) {
      return NextResponse.json(
        { error: "The Facebook Page selection expired." },
        { status: 400 },
      );
    }

    const body = await facebookJson(
      "https://graph.facebook.com/v23.0/me/accounts?fields=id,name,access_token",
      { headers: { Authorization: `Bearer ${result.pending.userAccessToken}` } },
    );
    const selected = Array.isArray(body.data)
      ? body.data
        .map((entry) => entry as Record<string, unknown>)
        .find((entry) => entry.id === pageId)
      : undefined;
    if (!selected || typeof selected.access_token !== "string") {
      return NextResponse.json(
        { error: "Facebook did not return access for that Page." },
        { status: 400 },
      );
    }

    await saveConnection({
      provider: "facebook",
      accountId: page.id,
      accountName: page.name,
      accessToken: selected.access_token,
      scopes: ["pages_show_list", "pages_read_engagement"],
    });
    (await cookies()).delete("social_oauth_facebook_pending");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Facebook Page could not be connected." },
      { status: 502 },
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await deleteConnection("facebook");
    (await cookies()).delete("social_oauth_facebook_pending");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Facebook could not be disconnected." },
      { status: 500 },
    );
  }
}
