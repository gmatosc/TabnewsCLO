import Head from "next/head";
import Script from "next/script";

export default function Docs() {
  return (
    <>
      <Head>
        <title>TabnewsCLO API documentation</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
        />
      </Head>
      <Script
        src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window.SwaggerUIBundle !== "function") {
            throw new Error("Swagger UI bundle did not expose its initializer");
          }

          window.SwaggerUIBundle({
            url: "/openapi.yaml",
            dom_id: "#swagger-ui",
          });
        }}
        onError={() => console.error("Failed to load Swagger UI from CDN")}
      />
      <main>
        <div id="swagger-ui" />
      </main>
    </>
  );
}
