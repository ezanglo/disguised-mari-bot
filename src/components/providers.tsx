"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

export function Providers({ children }: {
	children: React.ReactNode;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
				<TooltipProvider>
					{children}
				</TooltipProvider>
				<Toaster
					duration={5000}
				/>
				<TailwindIndicator />
				<div className="fixed bottom-0 right-0 p-5 flex items-center gap-2">
					<ModeToggle />
				</div>
			</ThemeProvider>
		</QueryClientProvider>
	)
}