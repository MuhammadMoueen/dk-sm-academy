import { z } from "zod";

const safeImageReference = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) =>
      value === "" ||
      (value.startsWith("/") &&
        !value.startsWith("//") &&
        !value.includes("\\") &&
        !value.split("/").includes("..")),
    "Use an existing same-site image path. Uploads are not configured.",
  );

const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3)]),
    text: z.string().trim().min(1).max(240),
  }),
  z.object({
    type: z.literal("paragraph"),
    text: z.string().trim().min(1).max(8000),
  }),
  z.object({
    type: z.literal("list"),
    ordered: z.boolean().optional(),
    items: z.array(z.string().trim().min(1).max(1000)).min(1).max(100),
  }),
  z.object({
    type: z.literal("link"),
    text: z.string().trim().min(1).max(500),
    href: z
      .string()
      .trim()
      .max(2048)
      .refine(
        (href) =>
          (/^https?:\/\//i.test(href) ||
            (href.startsWith("/") && !href.startsWith("//"))) &&
          !/[\u0000-\u001f]/.test(href),
        "Links must use HTTPS/HTTP or a same-site path.",
      ),
  }),
  z.object({
    type: z.literal("image"),
    src: safeImageReference.refine((src) => src.length > 0),
    alt: z.string().trim().min(1).max(500),
    caption: z.string().trim().max(500).optional(),
  }),
]);

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export const articleSchema = z.object({
  title: z.string().trim().min(1).max(180),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a URL-safe lowercase slug."),
  excerpt: z.string().trim().min(1).max(500),
  content: z.array(contentBlockSchema).max(200),
  thumbnailUrl: safeImageReference,
  category: z.string().trim().max(80).optional(),
  displayOrder: z.number().int().min(0).nullable().optional(),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(500).optional(),
});

export const portfolioSchema = z.object({
  clientName: z.string().trim().min(1).max(120),
  clientImage: safeImageReference,
  transactionImage: safeImageReference,
  review: z.string().trim().min(1).max(3000),
  rating: z.number().min(1).max(5).multipleOf(0.5),
  isVerified: z.boolean().default(false),
  status: z.enum(["draft", "published"]),
});

export const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(100),
  avatarUrl: safeImageReference,
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(12).max(128),
    confirmPassword: z.string().min(12).max(128),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
