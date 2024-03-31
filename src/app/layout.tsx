import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { cn, constructMetadata } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import WalletContextProvider from "@/components/wallet/WalletContextProvider";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<WalletContextProvider>
			<html lang="en" className="h-full">
				<head>
					<link
						rel="stylesheet"
						href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
						integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
					/>
				</head>
				<body
					className={cn(
						"relative h-full font-sans antialiased",
						inter.className
					)}
				>
					<main className="relative flex flex-col min-h-screen">
						<Providers>
							<Navbar />
							<div className="flex-grow flex-1">{children}</div>
							<Footer />
						</Providers>
					</main>

					<Toaster position="top-center" richColors />
				</body>
			</html>
		</WalletContextProvider>
	);
}
