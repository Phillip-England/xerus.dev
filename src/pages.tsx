import { Header } from "./components"

export const PageHome = (props: {
  mdContent: string
}) => {
  return (
    <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel='stylesheet' href='/static/css/index.css' />
      <title>Xerus - Simple Web Apps For Bun</title>
    </head>
    <body>

      <Header />
      <main>
        <section id='md-content' dangerouslySetInnerHTML={{ __html: props.mdContent }} />
      </main>
      <script src="/static/js/index.js"></script>
    </body>
    </html>
  )
}