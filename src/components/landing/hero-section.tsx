"use client";

import DotPattern from "@/components/magicui/dot-pattern";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CrownIcon } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
	return (
		<section className="grid lg:grid-cols-2 px-5 lg:px-20 w-full items-center">
			<DotPattern
				className={cn(
					"[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] -z-10",
					"lg:[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] lg:dark:opacity-30",
				)}
			/>
			<div className="flex flex-col gap-5 text-center lg:text-start">
				<motion.div
					initial={{opacity: 0, scale: 0.5}}
					animate={{opacity: 1, scale: 1}}
					transition={{duration: 0.5}}
					className="flex flex-col gap-5"
				>
				<span className="text-2xl md:text-4xl lg:text-6xl font-bold">
					Time to add <span className="italic">Disguised Mari</span> to your server.
				</span>
					<p className="text-muted-foreground text-sm md:text-base">
						Mari will assist you as you progress in the game by giving you recommendation and meta builds.
					</p>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: 0.5,
					}}
					className="flex flex-row gap-2 w-full justify-center lg:justify-start"
				>
					<Button className="rounded-full bg-indigo-500 hover:bg-indigo-500/90 text-white">
						ADD TO DISCORD
					</Button>
					<Button variant="secondary" className="rounded-full text-amber-500 border border-amber-500">
						<CrownIcon className="size-4 mr-2"/>
						Support Us
					</Button>
				</motion.div>
			</div>
			<motion.div
				initial={{opacity: 0, x: 100}}
				animate={{opacity: 1, x: 0}}
				className="p-5 order-first lg:order-last"
			>
				<Image
					className="animate-bounce-slow md:max-w-96 lg:max-w-full mx-auto"
					src="/images/mari-polaris.webp" alt="hero"
					width={1280} height={720}
				/>
			</motion.div>
		</section>
	)
}