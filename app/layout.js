import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Tilak Stone Arts | Premium Marble & Stone Masterpieces",
  description: "Crafting bespoke marble temples, statues, and stone artifacts. Elevate your space with our premium, customized designs.",
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
