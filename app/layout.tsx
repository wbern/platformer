import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "./components/NavBar/NavBar";
import ThemeRegistry from "./components/ThemeRegistry";
import "normalize.css/normalize.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "My portfolio experiment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html style={{ height: "100%" }} lang="en">
      <body
        style={{ background: "#333", height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: "hidden" }}
        className={inter.className}
      >
        <ThemeRegistry>
          {/* <header>
            <NavBar />
          </header> */}
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
