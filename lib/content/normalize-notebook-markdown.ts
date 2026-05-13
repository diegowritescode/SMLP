function stripYamlFrontmatter(raw: string) {
  const text = raw.replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) return text;

  const lines = text.split("\n");
  if (lines[0].trim() !== "---") return text;

  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      end = i;
      break;
    }
  }

  if (end === -1) return text;
  return lines.slice(end + 1).join("\n").replace(/^\s+/, "");
}

function stripCommentedYamlFrontmatter(raw: string) {
  const text = raw.replace(/^\uFEFF/, "");
  const lines = text.split("\n");
  if (lines.length === 0) return text;
  if (!/^\s*#\s*---\s*$/.test(lines[0])) return text;

  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (/^\s*#\s*---\s*$/.test(lines[i])) {
      end = i;
      break;
    }
  }

  if (end === -1) return text;
  return lines.slice(end + 1).join("\n").replace(/^\s+/, "");
}

function parseMarker(line: string): "markdown" | "code" | null {
  const match = line.match(/^\s*(?:#\s*)?%%(?:\s*\[(.*?)\])?\s*$/i);
  if (!match) return null;
  const descriptor = (match[1] ?? "").toLowerCase();
  if (descriptor.includes("markdown")) return "markdown";
  return "code";
}

function normalizeMarkdownCell(lines: string[]) {
  return lines
    .map((line) => {
      if (/^\s*#/.test(line)) {
        return line.replace(/^\s*#\s?/, "");
      }
      return line;
    })
    .join("\n")
    .trim();
}

function splitLeadingCommentBlock(lines: string[]) {
  const markdown: string[] = [];
  let index = 0;
  let started = false;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed === "") {
      if (!started) {
        index += 1;
        continue;
      }
      markdown.push("");
      index += 1;
      continue;
    }

    if (!trimmed.startsWith("#")) {
      break;
    }

    started = true;
    markdown.push(line.replace(/^\s*#\s?/, ""));
    index += 1;
  }

  return {
    markdown: markdown.join("\n").trim(),
    code: lines.slice(index).join("\n").trim(),
  };
}

function normalizeCodeCell(lines: string[]) {
  const { markdown, code } = splitLeadingCommentBlock(lines);
  const chunks: string[] = [];

  if (markdown) {
    chunks.push(markdown);
  }

  if (code) {
    chunks.push(`\`\`\`python\n${code}\n\`\`\``);
  }

  return chunks;
}

function inferInitialCellType(lines: string[]): "markdown" | "code" {
  const meaningful = lines.map((line) => line.trim()).filter((line) => line.length > 0);
  if (meaningful.length === 0) return "markdown";
  const commentLike = meaningful.filter((line) => line.startsWith("#")).length;
  if (commentLike === meaningful.length) return "markdown";
  return "code";
}

function looksLikeNotebookPercent(raw: string) {
  return /^\s*(?:#\s*)?%%(?:\s*\[.*?\])?\s*$/m.test(raw);
}

export function normalizeNotebookMarkdown(raw: string) {
  const stripped = stripCommentedYamlFrontmatter(stripYamlFrontmatter(raw));
  if (!looksLikeNotebookPercent(stripped)) return stripped.trim();

  const lines = stripped.split("\n");
  const chunks: string[] = [];
  let currentType: "markdown" | "code" = "markdown";
  let buffer: string[] = [];
  let seenMarker = false;

  const flush = () => {
    if (buffer.length === 0) return;
    const type = seenMarker ? currentType : inferInitialCellType(buffer);
    if (type === "markdown") {
      const normalized = normalizeMarkdownCell(buffer);
      if (normalized) chunks.push(normalized);
    } else {
      const normalized = normalizeCodeCell(buffer);
      for (const chunk of normalized) {
        if (chunk) chunks.push(chunk);
      }
    }
    buffer = [];
  };

  for (const line of lines) {
    const markerType = parseMarker(line);
    if (markerType) {
      flush();
      seenMarker = true;
      currentType = markerType;
      continue;
    }
    buffer.push(line);
  }

  flush();
  return chunks.join("\n\n").trim();
}
