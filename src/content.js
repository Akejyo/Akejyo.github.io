import { imageAssets } from "./image-assets.js";
import { readFile, readdir } from "node:fs/promises";
import matter from "gray-matter";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkCallouts from "./remark-callouts.js";
import rehypeCodeHighlight from "./rehype-code-highlight.js";
import remarkTyporaStyle from "./remark-typora-style.js";

function parseInlineStyle(style) {
  if (typeof style !== "string") return style;

  const result = {};

  for (const declaration of style.split(";")) {
    const separator = declaration.indexOf(":");
    if (separator === -1) continue;

    const property = declaration.slice(0, separator).trim();
    const value = declaration.slice(separator + 1).trim();

    if (!property || !value) continue;

    const key = property.startsWith("--")
      ? property
      : property.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    result[key] = value;
  }

  return result;
}

function TyporaImage({ style, ...props }) {
  return h("img", {
    ...props,
    style: parseInlineStyle(style),
  });
}

function Figure({ src, alt, caption, width = 1200, height = 700 }) {
  return h(
    "figure",
    null,
    h("img", { src, alt, loading: "lazy", width, height }),
    h("figcaption", null, caption),
  );
}
function Table(props) {
  return h(
    "div",
    {
      className: "table-scroll",
      tabIndex: 0,
      role: "region",
      "aria-label": "Scrollable data table",
    },
    h("table", props),
  );
}
export async function loadPosts(
  directory = new URL("../content/records/", import.meta.url),
) {
  const files = (await readdir(directory)).filter((file) =>
    file.endsWith(".mdx"),
  );
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(new URL(file, directory), "utf8");
      const { data, content } = matter(raw);
      for (const key of ["title", "date", "category", "description", "number"])
        if (!data[key]) throw new Error(`${file}: missing ${key}`);
      const slug = file.slice(0, -4);
      const { default: Content } = await evaluate(content, {
        ...runtime,
        remarkPlugins: [
          remarkGfm,
          remarkMath,
          remarkCallouts,
          remarkTyporaStyle,
        ],
        rehypePlugins: [rehypeKatex, rehypeSlug, rehypeCodeHighlight],
      });
      let html;

      try {
        html = renderToStaticMarkup(
          h(Content, {
            components: {
              Figure,
              table: Table,
              img: TyporaImage,
            },
          }),
        );
      } catch (error) {
        console.error(`Failed to render MDX: ${file}`);
        throw error;
      }

      html = html.replace(
        /(<img[^>]*\bsrc=")([^"]+)(")/g,
        (match, before, src, after) =>
          before + (imageAssets[src.replaceAll("&amp;", "&")] || src) + after,
      );
      const plain = html.replace(/<[^>]*>/g, " ");
      const readingTime = Math.max(
        1,
        Math.ceil(plain.split(/\s+/).filter(Boolean).length / 220),
      );
      const headings = [
        ...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g),
      ].map(([, id, title]) => ({ id, title: title.replace(/<[^>]*>/g, "") }));
      return {
        ...data,
        date: String(data.date),
        slug,
        html,
        readingTime,
        headings,
      };
    }),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
