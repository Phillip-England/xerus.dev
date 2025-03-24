import { WSContext, logger, Xerus, HTTPContext } from "xerus/xerus";
import { renderToString } from "react-dom/server";
import { PageHome } from "./src/pages";
import { marked } from "marked";
const hljs = require('highlight.js');
import { JSDOM } from "jsdom";
import React from "react";

const app = new Xerus();

app.use(logger);

app.onErr(async (c: HTTPContext): Promise<Response> => {
  let err = c.getErr();
  console.error(err)
  return c.setStatus(500).text("internal server error");
});

app.onNotFound(async (c: HTTPContext): Promise<Response> => {
  return c.setStatus(404).text("404 Not Found");
});

app.get("/", async (c: HTTPContext) => {
  let mdFile = Bun.file('./docs/index.md');
  let mdText = await mdFile.text();
  let mdHtml = await marked.parse(mdText);
  const dom = new JSDOM(mdHtml);
  const document = dom.window.document;
  document.querySelectorAll("pre code").forEach((codeElement: any) => {
    const code = codeElement.textContent || "";
    const langClass = codeElement.className.match(/language-(\w+)/);
    const language = langClass ? langClass[1] : "plaintext"; 
    try {
      const highlighted = hljs.highlight(code, { language }).value;
      codeElement.innerHTML = highlighted;
      codeElement.classList.add("hljs");
    } catch (e) {
      console.error("Highlight.js error:", e);
    }
  });
  let highlightedHtml = dom.serialize();
  return c.html(renderToString(<PageHome mdContent={highlightedHtml} />));
});

// serve static files from ./static
app.get("/static/*", async (c: HTTPContext) => {
  return await c.file('.' + c.path);
});

await app.listen()
