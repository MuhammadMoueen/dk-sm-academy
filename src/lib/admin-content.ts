import "server-only";

import type { PoolClient } from "pg";

export async function addAdminActivity(
  client: PoolClient,
  {
    actorId,
    entityType,
    entityId,
    action,
    summary,
  }: {
    actorId: number;
    entityType: "article" | "portfolio";
    entityId: string;
    action: "created" | "updated" | "published" | "unpublished" | "deleted";
    summary: string;
  },
) {
  await client.query(
    `INSERT INTO admin_activity (actor_id, entity_type, entity_id, action, summary)
     VALUES ($1, $2, $3, $4, $5)`,
    [actorId, entityType, entityId, action, summary.slice(0, 240)],
  );
}

export function publicationRequirementsMet({
  status,
  contentLength,
  images,
}: {
  status: "draft" | "published";
  contentLength: number;
  images: string[];
}) {
  if (status === "draft") return true;
  return contentLength > 0 && images.every((image) => image.length > 0);
}
