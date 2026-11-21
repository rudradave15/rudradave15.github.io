import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import {
  projectFrontmatterSchema,
  postFrontmatterSchema,
  type ProjectFrontmatter,
  type PostFrontmatter,
} from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Project = {
  frontmatter: ProjectFrontmatter;
  content: string;
};

export type Post = {
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
};

function readMdxDir(dir: string): { file: string; data: Record<string, unknown>; content: string }[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return { file, data, content };
    });
}

export function getAllProjects(): Project[] {
  return readMdxDir("projects")
    .map(({ data, content }) => ({
      frontmatter: projectFrontmatterSchema.parse(data),
      content,
    }))
    .sort((a, b) => Number(b.frontmatter.year) - Number(a.frontmatter.year));
}

export function getProject(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.frontmatter.slug === slug);
}

export function getAllPosts(): Post[] {
  return readMdxDir("writing")
    .map(({ data, content }) => {
      const frontmatter = postFrontmatterSchema.parse(data);
      return { frontmatter, content, readingTime: readingTime(content).text };
    })
    .filter((p) => !p.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.frontmatter.slug === slug);
}

export function getCV() {
  const full = path.join(CONTENT_DIR, "cv.json");
  return JSON.parse(fs.readFileSync(full, "utf8"));
}
