import { Inter } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import SessionProvider from "@/context/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cico Shop",
  description: "Themed merch, clothing, and accessories. Hand picked by Cico himself.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100`}>
        <div id="modal-root">
          <SessionProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </WishlistProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
