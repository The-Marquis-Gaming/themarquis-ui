import type { Metadata } from "next";
import NetworkProvider from "~~/components/NetworkProvider";
import { ScaffoldStarkAppWithProviders } from "~~/components/ScaffoldStarkAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://themarquis.xyz/"),
  title: "The Marquis",
  description:
    "Marquis is an open-source gaming platform built for on-chain mobile games on Starknet",
  icons: "/logomark.svg",
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
          <ScaffoldStarkAppWithProviders>
            <NetworkProvider>{children}</NetworkProvider>
          </ScaffoldStarkAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldStarkApp;
