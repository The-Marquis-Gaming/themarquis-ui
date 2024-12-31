import type { Metadata } from "next";
import { Suspense } from "react";
import LoadingPage from "~~/components/LoadingPage";
import { ScaffoldStarkAppWithProviders } from "~~/components/ScaffoldStarkAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://themarquis.xyz/"),
  title: "The Marquis",
  description:
    "Marquis is an open-source gaming platform built for on-chain mobile games on Starknet",
  applicationName: "The Marquis",
  icons: "/app-favicon.jpg",
  openGraph: {
    title: "The Marquis",
    description:
      "Marquis is an open source gaming platform built for on-chain mobile games on Starknet",
    url: "https://themarquis.xyz/",
    images: [
      {
        url: "/banner-meta-tmp.png",
        width: 1200,
        height: 628,
        alt: "Marquis Banner",
      },
    ],
    siteName: "The Marquis",
  },
  alternates: {
    canonical: "https://themarquis.xyz",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Marquis",
    description:
      "Marquis is an open-source gaming platform built for on-chain mobile games on Starknet",
    images: [
      {
        url: "/banner-meta-tmp.png",
        alt: "Marquis Banner",
      },
    ],
  },
};

const ScaffoldStarkApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider
          enableSystem={false}
          forcedTheme="dark"
          defaultTheme="dark"
        >
          <Suspense fallback={<LoadingPage />}>
            <ScaffoldStarkAppWithProviders>
              {children}
            </ScaffoldStarkAppWithProviders>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldStarkApp;
