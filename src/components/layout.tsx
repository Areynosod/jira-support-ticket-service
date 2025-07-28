import { FC } from "hono/jsx";

const Layout: FC = (props) => {
  return (
    <html>
      <head>
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        ></script>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <link rel="stylesheet" href="/output.css" />
      </head>
      <body id="main-content" className="bg-blend-darken">
        {props.children}
      </body>
    </html>
  );
};

export default Layout;
