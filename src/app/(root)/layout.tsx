import { Header } from "@/components/header";
import { ReactNode } from "react";

export default function RootLayout({ children}: { children: ReactNode }) {
	return (
		<main>
			<Header/>
			<div className="px-5">
				{children}
			</div>
		</main>
	)
}