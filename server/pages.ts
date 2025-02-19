

export const root = (title: string, content: string) => {
  return `
    <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel='stylesheet' href='/static/css/index.css'/>
      <title>${title}</title>
    </head>
    <body>
      ${header()}
      <main class='scroll-hidden'>
        ${content}
      </main>
    </body>
    </html>
  `
}

export const header = () => {
  return `
    <header>
      <img src='/static/img/logo-dark.svg' width='50'/>
    </header>
  `
}