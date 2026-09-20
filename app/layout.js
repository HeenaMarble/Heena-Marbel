import "./globals.css";
import Providers from "@/components/Providers";

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
          {children}
        </Providers>
      </body>
    </html>
  );
}
