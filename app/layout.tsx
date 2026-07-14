import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const acumin = localFont({
  src: [
    { path: "../public/fonts/Acumin-RPro.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Acumin-BdPro.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/Acumin-ItPro.otf", weight: "400", style: "italic" },
    { path: "../public/fonts/Acumin-BdItPro.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-acumin",
  display: "swap",
});

export const metadata = {
  title: "Borghini Creative OS",
  description: "Prosjektstyring for Borghini Entertainment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className={acumin.variable}>
      <body className="bg-black text-white antialiased">
        <div className="flex min-h-screen overflow-x-hidden">
          <Sidebar />
          <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
