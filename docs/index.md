# Xerus
<p class='pink-text fade-in'>Simple Web Apps For Bun</p>

```ts
let app = new Xerus()

app.use(logger)

app.get('/', async(c: Context) => {
  return c.html(`<h1>O'Doyle Rules!</h1>`)
})

const server = Bun.serve({
  port: 8080,
  fetch: async (req: Request) => {
    return await app.run(req);
  },
});

console.log(`Server running on ${server.port}`);
```

## Installation
Install directly from github:

```bash
bun add github:phillip-england/xerus
```

## Handler
A `Handler` is just a function which accept a `Context` and return a `Promise<Response>`.

```ts
let handler = async (c: Context): Promise<Response> => {
  return c.html(`<h1>O'Doyle Rules!</h1>`)
}
```

Register a `Handler`:
```ts
app.get('/', handler)
```

## Routing
Use static, parameterized, or wildcard routes:

```ts
app.use('/static', handler)
app.use('/param/:id', handler)
app.use('/static/*', handler)
```

## Route Groups
Create a `RouteGroup`:

```ts
app.group('/api')
  .post('/user/:id', handler)
  .post('/post/:id', handler)
```

## Middleware
Middleware run in this order:
1. Global
2. Group
3. Handler


Create a new `Middleware`:

```ts
let mw = new Middleware(
  async (c: Context, next): Promise<void | Response> => {
    console.log('logic before handler');
    next();
    console.log("logic after handler");
  },
);
```

Use the `Middleware` at the global-level:
```ts
app.use(mw)
```

Chain as many as you'd like:
```ts
app.use(mw1, mw2, mw3)
```


Use the `Middleware` at the group-level:
```ts
app.group('/api', mw)
  .post('/user/:id', handler)
  .post('/post/:id', handler)
```

Use the `Middleware` at the handler-level:
```ts
app.get('/', handler, mw)
```