import { Inter, PT_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "TicketsNow - Gallery Canvas",
  description: "High-concurrency ticketing engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${ptSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
