import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head></Head>
      <body className="py-4">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
