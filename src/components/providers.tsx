"use client";

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
		</ThemeProvider>
	)
}