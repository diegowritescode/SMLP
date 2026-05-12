import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/utils/slugify";

interface MarkdownReaderProps {
  markdown: string;
  containerId?: string;
  className?: string;
}

function textFromNode(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { children?: unknown[]; value?: string };
  if (typeof n.value === "string") return n.value;
  if (!Array.isArray(n.children)) return "";
  return n.children.map(textFromNode).join(" ");
}

export function MarkdownReader({ markdown, containerId = "reader-content", className = "" }: MarkdownReaderProps) {
  return (
    <div id={containerId} className={`reader-content reader-column ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ node, children, ...props }) => {
            const id = slugify(textFromNode(node));
            return (
              <h1 id={id} {...props}>
                {children}
              </h1>
            );
          },
          h2: ({ node, children, ...props }) => {
            const id = slugify(textFromNode(node));
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ node, children, ...props }) => {
            const id = slugify(textFromNode(node));
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            );
          },
          table: ({ children }) => (
            <div className="table-wrap">
              <table>{children}</table>
            </div>
          ),
          a: ({ children, ...props }) => (
            <a className="text-[var(--accent-dark)] underline decoration-[var(--line-strong)] underline-offset-4" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
