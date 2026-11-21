import type { MDXComponents } from "mdx/types";
import { Receipt } from "@/components/receipt";

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-14 font-display text-[26px] font-semibold tracking-tight text-ink"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-10 font-display text-[19px] font-semibold text-ink" {...props} />
  ),
  p: (props) => (
    <p className="measure mt-4 text-[17px] leading-relaxed text-ink" {...props} />
  ),
  ul: (props) => (
    <ul className="measure mt-4 list-disc space-y-2 pl-5 text-[17px] leading-relaxed" {...props} />
  ),
  ol: (props) => (
    <ol className="measure mt-4 list-decimal space-y-2 pl-5 text-[17px] leading-relaxed" {...props} />
  ),
  a: (props) => <a className="link-draw text-signal" {...props} />,
  code: (props) => (
    <code className="rounded-[4px] bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em]" {...props} />
  ),
  pre: (props) => (
    <pre
      className="mt-5 max-w-full overflow-x-auto rounded-[4px] bg-terminal px-5 py-4 font-mono text-[13px] leading-relaxed text-terminal-ink"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="measure mt-5 border-l-2 border-flag pl-4 text-[16px] italic text-ink-muted"
      {...props}
    />
  ),
  hr: () => <hr className="mt-10 border-line" />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  Receipt,
};
