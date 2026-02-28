import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Healio - AI-Enabled Smart Healthcare Platform",
    description: "AI-Powered Healthcare Appointment & Telemedicine Platform",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className="antialiased">
        {children}
        </body>
        </html>
    );
}
