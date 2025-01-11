import "@/src/styles/globals.css"; // Global styles
import type { AppProps } from "next/app";
import AuthLayout from "@/layouts/AuthLayout"; // Example layout

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthLayout>
      <Component {...pageProps} />
    </AuthLayout>
  );
}

export default MyApp;