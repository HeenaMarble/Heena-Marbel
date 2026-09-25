import "./globals.css";
import Providers from "@/components/Providers";
import AnnouncementBar from "@/components/AnnouncementBar";

// Ensures the announcement banner (and anything else reading live DB state
// in this tree) is re-fetched on every request instead of being cached at
// build time.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "HEENA MARBLE | Premium Marble & Stone Masterpieces",
  description: "Crafting bespoke marble temples, statues, and stone artifacts. Elevate your space with our premium, customized designs.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/icon.png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AnnouncementBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
