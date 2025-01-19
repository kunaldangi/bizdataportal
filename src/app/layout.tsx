import "./globals.css";

import type { Metadata } from "next";
import { Roboto } from "next/font/google";

const roboto = Roboto({
	subsets: ["latin"],
	weight: "400"
});

export const metadata: Metadata = {
	title: "",
	description: "",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
	return (
		<html lang="en">
			<body className={roboto.className}>
				{children}
			</body>
		</html>
	);
}
