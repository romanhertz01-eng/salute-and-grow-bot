import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "h2", "h3", "h4", "p", "br", "hr",
  "ul", "ol", "li",
  "strong", "em", "b", "i", "u", "s", "code", "pre",
  "a", "blockquote",
  "table", "thead", "tbody", "tr", "th", "td",
  "span", "div",
];

const ALLOWED_ATTR = ["href", "target", "rel", "title", "colspan", "rowspan"];

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}