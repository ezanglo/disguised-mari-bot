"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

type ProviderProps = {
	children: React.ReactNode;
}

export function Providers({children}: ProviderProps) {
	return (
		<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
			{children}
			<TailwindIndicator/>
			<div className="fixed bottom-0 right-0 p-5 flex items-center gap-2">
				<ModeToggle/>
			</div>
		</ThemeProvider>
	)
}