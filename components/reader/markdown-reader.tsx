import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/utils/slugify";

interface MarkdownReaderProps {
  markdown: string;
  containerId?: string;
}

function textFromNode(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { children?: unknown[]; value?: string };
  if (typeof n.value === "string") return n.value;
  if (!Array.isArray(n.children)) return "";
  return n.children.map(textFromNode).join(" ");
}

export function MarkdownReader({ markdown, containerId = "reader-content" }: MarkdownReaderProps) {
  return (
    <div id={containerId} className="prose prose-zinc dark:prose-invert max-w-none leading-8">
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
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
