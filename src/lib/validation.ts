
import { z } from "zod";

const safeImageReference = z
  .string()
  .trim()
  .max(2048, "Image path is too long.")
  .refine(
    (value) =>
      value === "" ||
      (value.startsWith("/") &&
        !value.startsWith("//") &&
        !value.includes("\\") &&
        !value.split("/").includes("..")),
    "Upload an image or use a valid same-site image path.",
  );

const imageReference = safeImageReference.or(
  z.string().url().refine((value) => {
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        url.hostname === "res.cloudinary.com"
      );
    } catch {
      return false;
    }
  }, "Use a valid same-site image path or HTTPS Cloudinary URL."),
);

const hashtagsSchema = z
  .array(
    z
      .string()
      .trim()
      .regex(
        /^#?[a-zA-Z0-9][a-zA-Z0-9_-]{0,39}$/,
        "Enter each hashtag separately, e.g. #trading #crypto.",
      ),
  )
  .max(10, "You can add a maximum of 10 hashtags.")
  .default([]);

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
    items: z
      .array(z.string().trim().min(1).max(1000))
      .min(1)
      .max(100),
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
        "Enter a valid HTTP/HTTPS URL or same-site path.",
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
  title: z
    .string()
    .trim()
    .min(1, "Enter an article title.")
    .max(180, "Article title must be 180 characters or fewer."),
  slug: z
    .string()
    .trim()
    .min(1, "An article slug could not be generated from the title.")
    .max(180)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use a valid title with English letters or numbers to generate the article URL.",
    ),
  excerpt: z
    .string()
    .trim()
    .min(1, "Enter a short description.")
    .max(500, "Description must be 500 characters or fewer."),
  articleLink: z
    .string()
    .trim()
    .max(2048, "Article link is too long.")
    .refine(
      (value) => value === "" || /^https?:\/\/[^\s]+$/i.test(value),
      "Enter a valid link starting with https:// or http://, or leave it blank.",
    )
    .optional()
    .default(""),
  content: z.array(contentBlockSchema).max(200),
  thumbnailUrl: imageReference,
  hashtags: hashtagsSchema,
  category: z.string().trim().max(80).optional(),
  displayOrder: z.number().int().min(0).nullable().optional(),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(500).optional(),
});

export const portfolioSchema = z.object({
  clientName: z.string().trim().min(1).max(120),
  clientImage: imageReference,
  transactionImage: imageReference,
  review: z.string().trim().min(1).max(3000),
  rating: z.number().min(1).max(5).multipleOf(0.5),
  isVerified: z.boolean().default(false),
  status: z.enum(["draft", "published"]),
});

export const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(100),
  avatarUrl: imageReference,
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
