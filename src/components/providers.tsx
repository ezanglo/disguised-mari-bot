"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

type ProviderProps = {
	children: React.ReactNode;
}

export function Providers({children}: ProviderProps) {
	return (
		<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
			<TooltipProvider>
				{children}
			</TooltipProvider>
			<Toaster
				duration={5000}
			/>
			<TailwindIndicator/>
			<div className="fixed bottom-0 right-0 p-5 flex items-center gap-2">
				<ModeToggle/>
			</div>
		</ThemeProvider>
	)
}