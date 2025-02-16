import { Context, logger, Xerus } from "xerus/xerus";
import { renderToString } from "react-dom/server";
import { PageHome } from "./src/pages";
import { marked } from "marked";
const hljs = require('highlight.js');
import { JSDOM } from "jsdom";

const app = new Xerus();

// setup logging
app.use(logger);

// what to do if any errors are thrown
app.onErr(async (c: Context): Promise<Response> => {
  let err = c.getErr();
  console.error(err)
  return c.status(500).text("internal server error");
});

// what to do if a 404 is thrown
app.onNotFound(async (c: Context): Promise<Response> => {
  return c.status(404).text("404 Not Found");
});

// basic endpoint
app.get("/", async (c: Context) => {
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
app.get("/static/*", async (c: Context) => {
  let file = Bun.file("." + c.path);
  if (!file.exists) {
    return c.status(404).text("file not found");
  }
  return await c.file(file);
});

// running the application
const server = Bun.serve({
  port: 8080,
  fetch: async (req: Request) => {
    return await app.run(req);
  },
});

console.log(`Server running on ${server.port}`);

