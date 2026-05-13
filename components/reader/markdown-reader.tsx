import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { getNextHeadingId } from "@/lib/content/heading-ids";
import { CollapsibleCodeBlock } from "@/components/reader/collapsible-code-block";

interface MarkdownReaderProps {
  markdown: string;
  containerId?: string;
  className?: string;
}

interface HastLikeNode {
  type?: string;
  tagName?: string;
  value?: string;
  children?: HastLikeNode[];
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

function isStandaloneImageParagraph(node: unknown): boolean {
  if (!node || typeof node !== "object") return false;
  const n = node as HastLikeNode;
  if (!Array.isArray(n.children)) return false;

  const meaningfulChildren = n.children.filter((child) => {
    if (child.type !== "text") return true;
    return typeof child.value !== "string" || child.value.trim() !== "";
  });

  if (meaningfulChildren.length !== 1) return false;
  const candidate = meaningfulChildren[0];
  return candidate.type === "element" && (candidate.tagName === "img" || candidate.tagName === "picture");
}

export function MarkdownReader({ markdown, containerId = "reader-content", className = "" }: MarkdownReaderProps) {
  const seenHeadingIds = new Map<string, number>();
  const resolveHeadingId = (node: unknown) => getNextHeadingId(textFromNode(node), seenHeadingIds);

  return (
    <div id={containerId} className={`reader-content reader-column ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ node, children, ...props }) => {
            const id = resolveHeadingId(node);
            return (
              <h1 id={id} {...props}>
                {children}
              </h1>
            );
          },
          h2: ({ node, children, ...props }) => {
            const id = resolveHeadingId(node);
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ node, children, ...props }) => {
            const id = resolveHeadingId(node);
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            );
          },
          p: ({ node, children, ...props }) => {
            if (isStandaloneImageParagraph(node)) return <>{children}</>;
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
          pre: ({ children }) => <CollapsibleCodeBlock>{children}</CollapsibleCodeBlock>,
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
