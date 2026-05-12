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

function isNumericLike(value: string): boolean {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return false;
  return /^[$€£]?\s*-?\d[\d.,\s]*(%|x|bps)?$/i.test(normalized);
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
          p: ({ node, children, ...props }) => {
            const n = node as { children?: Array<{ type?: string }> };
            const singleImage = Array.isArray(n.children) && n.children.length === 1 && n.children[0]?.type === "image";
            if (singleImage) return <>{children}</>;
            return <p {...props}>{children}</p>;
          },
          img: ({ src, alt, title }) => {
            const safeSrc = typeof src === "string" ? src : "";
            if (!safeSrc) return null;
            const caption = title?.trim() || alt?.trim() || "";

            return (
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={safeSrc} alt={alt || "Imagen del capitulo"} title={title} loading="lazy" className="reader-figure-image" />
                {caption ? <figcaption>{caption}</figcaption> : null}
              </figure>
            );
          },
          table: ({ children }) => (
            <div className="table-wrap">
              <table>{children}</table>
            </div>
          ),
          th: ({ node, children, className, ...props }) => {
            const numeric = isNumericLike(textFromNode(node));
            return (
              <th className={`${className ?? ""} ${numeric ? "number-col" : ""}`.trim()} {...props}>
                {children}
              </th>
            );
          },
          td: ({ node, children, className, ...props }) => {
            const numeric = isNumericLike(textFromNode(node));
            return (
              <td className={`${className ?? ""} ${numeric ? "number-col" : ""}`.trim()} {...props}>
                {children}
              </td>
            );
          },
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
