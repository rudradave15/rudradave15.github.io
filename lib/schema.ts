import { z } from "zod";

export const receiptSchema = z.object({
  id: z.string(),
  claim: z.string(),
  detail: z.string(),
  source: z.string(),
  href: z.string().url().optional(),
  date: z.string().optional(),
});
export type Receipt = z.infer<typeof receiptSchema>;

export const artifactSchema = z.object({
  kind: z.enum(["repo", "screenshot", "recording", "doc"]),
  label: z.string(),
  href: z.string().optional(),
  note: z.string().optional(),
});
export type Artifact = z.infer<typeof artifactSchema>;

export const projectStatus = z.enum([
  "live",
  "active",
  "shipped",
  "paused",
  "archived",
]);

export const projectFrontmatterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  oneLiner: z.string(),
  domain: z.string(),
  stack: z.array(z.string()),
  status: projectStatus,
  year: z.string(),
  featured: z.boolean().default(false),
  contentComplete: z.boolean().default(false),
  contribution: z.string().optional(),
  artifacts: z.array(artifactSchema).default([]),
  gaps: z.array(z.string()).default([]),
});
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export const postFrontmatterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  date: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});
export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export const cvSchema = z.object({
  name: z.string(),
  headline: z.string(),
  location: z.string().optional(),
  email: z.string().email(),
  links: z.array(
    z.object({ label: z.string(), href: z.string() })
  ),
  education: z.array(
    z.object({
      school: z.string(),
      program: z.string(),
      period: z.string(),
    })
  ),
  experience: z.array(
    z.object({
      org: z.string(),
      role: z.string(),
      period: z.string(),
      bullets: z.array(z.string()),
    })
  ),
  skills: z.array(z.object({ group: z.string(), items: z.array(z.string()) })),
});
export type CV = z.infer<typeof cvSchema>;
