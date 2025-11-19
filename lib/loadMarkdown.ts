import fs from "fs";
import path from "path";

export function loadMarkdown(slug: "privacy" | "terms") {
  const filePath = path.join(process.cwd(), "", `${slug}.md`);
  return fs.readFileSync(filePath, "utf8");
}