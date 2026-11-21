// Generates public/cv.pdf directly from content/cv.json so the PDF can never
// drift from what the site itself says. Plain, monospace-flavored layout,
// deliberately not trying to out-design the site, just match its facts.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

const cv = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "cv.json"), "utf8"));

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN = 56;
const INK = rgb(0.063, 0.078, 0.071);
const MUTED = rgb(0.353, 0.384, 0.361);
const SIGNAL = rgb(0.106, 0.231, 0.812);

async function main() {
  const doc = await PDFDocument.create();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const mono = await doc.embedFont(StandardFonts.Courier);

  let page = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  function newPageIfNeeded(space) {
    if (y - space < MARGIN) {
      page = doc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }
  }

  function text(str, { font = regular, size = 10, color = INK, x = MARGIN, gap = 14 } = {}) {
    newPageIfNeeded(gap);
    page.drawText(str, { x, y, size, font, color });
    y -= gap;
  }

  function wrap(str, maxWidth, font, size) {
    const words = str.split(" ");
    const lines = [];
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function paragraph(str, { size = 9.5, color = MUTED, gap = 12.5, indent = MARGIN } = {}) {
    const lines = wrap(str, PAGE_W - indent - MARGIN, regular, size);
    for (const l of lines) {
      newPageIfNeeded(gap);
      page.drawText(l, { x: indent, y, size, font: regular, color });
      y -= gap;
    }
  }

  function rule() {
    newPageIfNeeded(10);
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_W - MARGIN, y },
      thickness: 0.75,
      color: rgb(0.9, 0.91, 0.89),
    });
    y -= 14;
  }

  function sectionHeader(label) {
    newPageIfNeeded(24);
    y -= 6;
    page.drawText(label.toUpperCase(), {
      x: MARGIN,
      y,
      size: 9,
      font: mono,
      color: MUTED,
    });
    y -= 16;
  }

  text(cv.name, { font: bold, size: 22, gap: 26, color: SIGNAL });
  const contactLine = [cv.location, cv.email, ...cv.links.filter((l) => !l.href.startsWith("TODO")).map((l) => l.href)]
    .filter(Boolean)
    .join("   ·   ");
  text(contactLine, { font: mono, size: 8.5, color: MUTED, gap: 20 });
  rule();

  sectionHeader("Experience");
  for (const e of cv.experience) {
    text(`${e.role}, ${e.org}`, { font: bold, size: 11, gap: 14 });
    text(e.period, { font: mono, size: 8, color: MUTED, gap: 13 });
    for (const b of e.bullets) paragraph("• " + b);
    y -= 6;
  }

  sectionHeader("Leadership");
  for (const e of cv.leadership ?? []) {
    text(`${e.role}, ${e.org}`, { font: bold, size: 11, gap: 14 });
    for (const b of e.bullets) paragraph("• " + b);
    y -= 6;
  }

  sectionHeader("Education");
  for (const e of cv.education) {
    text(`${e.program}, ${e.school}`, { font: bold, size: 11, gap: 14 });
    text(e.period, { font: mono, size: 8, color: MUTED, gap: 16 });
  }

  sectionHeader("Skills");
  for (const s of cv.skills) {
    paragraph(`${s.group}: ${s.items.join(", ")}`, { color: INK, size: 9.5 });
  }

  const bytes = await doc.save();
  const outPath = path.join(process.cwd(), "public", "cv.pdf");
  fs.writeFileSync(outPath, bytes);
  console.log("Wrote", outPath);
}

main();
