import type { Metadata } from "next";
import Image from "next/image";
import { ScaffoldStarkAppWithProviders } from "~~/components/ScaffoldStarkAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";



export const metadata: Metadata = {
  title: "The Marquis",
  description: "App created with starknet",
  icons: "/logomark.svg",
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
            {children}
          </ScaffoldStarkAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldStarkApp;
