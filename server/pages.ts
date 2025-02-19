

export const root = (title: string, content: string) => {
  return `
    <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel='stylesheet' href='/static/css/index.css'/>
      <link rel="icon" type="image/x-icon" href="favicon.ico">
      <title>${title}</title>
    </head>
    <body class='content-grid'>
      ${header()}
      ${navbar()}
      <main class='scroll-hidden'>
        <article >
          ${content}
        </article>
      </main>
      <script src='/static/js/index.js'></script>
    </body>
    </html>
  `
}

export const header = () => {
  return `
    <header>
      <a  class='logo'>
        <img src='/static/img/logo-dark.svg' width='50'/>    
      </a>
      <div class='icon-wrapper'>
        <svg class='bars' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
        </svg>
      </div>
    </header>
  `
}

export const navbar = () => {
  return `
    <nav>
      <ul class='scroll-hidden'>
        ${navItem("#xerus", "Xerus")}
        ${navItem("#installation", "Installation")}
        ${navItem("#hello-world", "Hello, World")}
        ${navItem("#httphandlerfunc", "HTTP Handler Func")}
        ${navItem("#routing", "Routing")}
        ${navItem("#static-files", "Static Files")}
        ${navItem("#middleware", "Middleware")}
        ${navItem("#httpcontext", "HTTPContext")}
        ${navItem("#redirect-the-request", "Redirect The Request")}
        ${navItem("#parse-the-request-body", "Parse The Request Body")}
        ${navItem("#get-dynamic-path-param", "Get Dynamic Path Param")}
        ${navItem("#set-status-code", "Set Status Code")}
        ${navItem("#set-response-headers", "Set Response Headers")}
        ${navItem("#get-request-header", "Get Request Header")}
        ${navItem("#respond-with-html-json-or-text", "Respond with HTML, JSON, or TEXT")}
        ${navItem("#stream-a-response", "Stream A Response")}
        ${navItem("#response-with-a-file", "Response With A File")}
        ${navItem("#stream-a-file", "Stream A File")}
        ${navItem("#set-get-and-clear-cookies", "Set, Get, And Clear Cookies")}
        ${navItem("#custom-404", "Custom 404")}
        ${navItem("#custom-error-handling", "Custom Error Handling")}
        ${navItem("#web-sockets", "Web Sockets")}
      </ul>
    </nav>
  `;
};


export const navItem = (href: string, text: string) => {
  return `
    <li>
      <a href='${href}'>${text}</a>
    </li>
  `
}