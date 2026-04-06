import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Healio - Your Health Deserves the Right Specialist",
    description: "Connect with top rated doctors who listen and prioritize your health journey. Find specialists, book appointments, and access 24/7 virtual care.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable}>
        <body className="antialiased">
        {children}
        </body>
        </html>
    );
}
