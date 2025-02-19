import { HTTPContext, logger, Xerus } from "xerus/xerus";
import { root } from "./server/pages";
const marked = require('marked');
const hljs = require('highlight.js');
const { JSDOM } = require('jsdom');

async function md(filePath: string) {
  try {
      const file = Bun.file(filePath);
      let markdown = await file.text();
      let htmlContent = marked.parse(markdown);
      const dom = new JSDOM(`<body>${htmlContent}</body>`);
      const document = dom.window.document;

      document.querySelectorAll('pre').forEach((pre: any) => {
          const spanWrapper = document.createElement('div');
          spanWrapper.classList.add('code');
          pre.parentNode.insertBefore(spanWrapper, pre);
          spanWrapper.appendChild(pre);
      });

      document.querySelectorAll('pre code').forEach((block: any) => {
          const language = block.className.replace('language-', '').trim() || 'plaintext';
          const highlighted = hljs.highlight(block.textContent, { language }).value;
          block.innerHTML = `${highlighted}`;
          block.classList.add('hljs');
      });

      return document.body.innerHTML;
  } catch (error) {
      console.error('Error processing markdown:', error);
      return '<p>Error processing markdown file.</p>';
  }
}


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
  let mdContent = await md('./README.md')
  return c.html(root("Xerus", mdContent));
});

app.get("/static/*", async (c: HTTPContext) => {
  return await c.file("." + c.path);
});

await app.listen()

