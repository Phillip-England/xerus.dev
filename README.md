# Xerus

Simple web apps for Bun.

<a href='https://github.com/phillip-england/xerus' style='width:64px; height:64px;'>
  <svg style='width:64px; height:64px;'  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path fill-rule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clip-rule="evenodd"/>
  </svg>
</a>

## Installation

```bash
bun add github:phillip-england/xerus
```

## Hello, World
Create an `index.ts` and paste in the following code:

```ts
import { HTTPContext, logger, Xerus } from "xerus/xerus";

let app = new Xerus()

app.use(logger)

app.get('/', async (c: HTTPContext) => {
  return c.html(`<h1>O'Doyle Rules!</h1>`)
})

await app.listen()
```

Run the application using:

```bash
bun run --hot index.ts
```

Visit `localhost:8080`

## HTTPHandlerFunc

An `HTTPHandlerFunc` takes in an `HTTPContext` and returns `Promise<Response>`:
```ts
let handler = async (c: HTTPContext) => {
  return c.html(`<h1>O'Doyle Rules</h1>`)
}

app.get('/', handler)
```


## Routing

`Xerus` supports static, dynamic, and wildcard paths:

```ts
app.get('/', handler)
app.get('/user/:id', handler)
app.get('/static/*', handler)
```

Group routing is also supported:

```ts
app.group('/api')
  .post('/user/:id', handler)
  .post('/user/post/:postNumber', handler)
```

## Static Files

Use a wildcard to serve static files from `./static`:

```ts
app.get("/static/*", async (c: Context) => {
  return await c.file("." + c.path);
});
```

## Middleware

Middleware executes in the following order:
1. Global
2. Group
3. Route

Create a new `Middleware`:
```ts
let mw = new Middleware(
  async (c: HTTPContext, next: MiddlewareNextFn): Promise<void | Response> => {
    console.log('logic before handler');
    next();
    console.log("logic after handler");
  },
);
```

Link it globally:
```ts
app.use(mw)
```

Or to a group:
```ts
app.group('/api', mw) // <=====
  .post('/user/:id', handler)
  .post('/user/post/:postNumber', handler)
```

Or to a route:
```ts
app.get('/', handler, mw) // <=====
```

Chain as many as you'd like to all three types:
```ts
app.use(mw, mw, mw)

app.group('/api', mw, mw, mw)
  .post('/user/:id', handler)
  .post('/user/post/:postNumber', handler)

app.get('/', handler, mw, mw, mw)
```


## HTTPContext
`HTTPContext` allows us to work with the incoming requests and prepare responses. Here are the features it provides.

### Redirect The Request
```ts
app.get('/', async (c: HTTPContext) => {
  return c.html(`<h1>O'Doyle Rules</h1>`)
})

app.get('/redirect', async(c: HTTPContext) => {
  return c.redirect('/')
})
```

### Parse The Request Body
Use the `BodyType` enum to enforce a specific type of data in the request body:

```ts
app.post('/body/text', async (c: HTTPContext) => {
  let data = await c.parseBody(BodyType.TEXT)
  return c.json({data: data})
})

app.post('/body/json', async (c: HTTPContext) => {
  let data = await c.parseBody(BodyType.JSON)
  return c.json({data: data})
})

app.post('/body/multipart', async (c: HTTPContext) => {
  let data = await c.parseBody(BodyType.MULTIPART_FORM)
  return c.json({data: data})
})

app.post('/body/form', async (c: HTTPContext) => {
  let data = await c.parseBody(BodyType.FORM)
  return c.json({data: data})
})
```

### Get Dynamic Path Param
```ts
app.get('/user/:id', async (c: HTTPContext) => {
  let id = c.getParam('id')
  return c.html(`<h1>O'Doyle Rules Times ${id}!</h1>`)
})
```

### Set Status Code
```ts
app.get('/', async (c: HTTPContext) => {
  return c.setStatus(404).html(`<h1>O'Doyle Not Found</h1>`)
})
```

### Set Response Headers
```ts
app.get('/', async (c: HTTPContext) => {
  c.setHeader('X-Who-Rules', `O'Doyle Rules`)
  return c.html(`<h1>O'Doyle Rules!</h1>`)
})
```

### Get Request Header
```ts
app.get('/', async (c: HTTPContext) => {
  let headerVal = c.getHeader('X-Who-Rules')
  if (headerVal) {
    return c.html(`<h1>${headerVal}</h1>`)
  }
  return c.html(`<h1>Header missing</h1>`)
})
```

### Respond with HTML, JSON, or TEXT
```ts
app.get('/html', async (c: HTTPContext) => {
  return c.html(`<h1>O'Doyle Rules!</h1>`)
})

app.get('/json', async (c: HTTPContext) => {
  return c.json({message: `O'Doyle Rules!`})
})

app.get('/text', async (c: HTTPContext) => {
  return c.text(`O'Doyle Rules!`)
})
```

### Stream A Response
```ts
app.get('/', async (c: HTTPContext) => {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let count = 0;
      const interval = setInterval(() => {
        controller.enqueue(encoder.encode(`O'Doyle Rules! ${count}\n`));
        count++;
        if (count >= 3) {
          clearInterval(interval);
          controller.close();
        }
      }, 1000);
    }
  });
  c.setHeader("Content-Type", "text/plain");
  c.setHeader("Content-Disposition", 'attachment; filename="odoyle_rules.txt"');
  return c.stream(stream);
});
```

### Response With A File
```ts
app.get('/', async (c: HTTPContext) => {
  return c.file("./path/to/file");
});
```

### Stream A File
```ts
app.get('/', async (c: HTTPContext) => {
  return c.file("./path/to/file", true);
});
```

### Set, Get, And Clear Cookies
```ts
app.get('/set', async (c: HTTPContext) => {
  c.setCookie('secret', "O'Doyle_Rules!")
  return c.redirect('/get')
});

app.get('/get', async (c: HTTPContext) => {
  let cookie = c.getCookie('secret')
  if (cookie) {
    return c.text(`visit /clear to clear the cookie with the value: ${cookie}`)
  }
  return c.text('visit /set to set the cookie')
})

app.get('/clear', async (c: HTTPContext) => {
  c.clearCookie('secret')
  return c.redirect('/get')
})
```

## Custom 404

```ts
app.onNotFound(async (c: HTTPContext): Promise<Response> => {
  return c.setStatus(404).text("404 Not Found");
});
```

## Custom Error Handling

```ts
app.onErr(async (c: HTTPContext): Promise<Response> => {
  let err = c.getErr();
  console.error(err);
  return c.setStatus(500).text("internal server error");
});
```

## Web Sockets

Setup a new websocket route, using `onConnect` for pre-connect authorization:
```ts
app.ws("/chat", {
  async open(ws) {
    let c = ws.data // get the context
    
  },
  async message(ws, message) {

  },
  async close(ws, code, message) {

  },
  async onConnect(c: WSContext) {
    c.set('secret', "O'Doyle") // set pre-connect data
  }
});
```