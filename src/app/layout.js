import { Inter } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import SessionProvider from "@/context/SessionProvider";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cico Shop",
  description: "Themed merch, clothing, and accessories. Hand picked by Cico himself.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <div id="modal-root" className="bg-slate-100 z-[5000] mb-[596px] md:mb-96">
          <SessionProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </WishlistProvider>
          </SessionProvider>
        </div>
        <Footer />
      </body>
    </html>
  );
}
