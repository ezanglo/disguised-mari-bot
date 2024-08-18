"use client";

import { motion } from "framer-motion";
import React from "react";

type HeaderWrapperProps = {
	children?: React.ReactNode;
}
export function HeaderWrapper({ children}: HeaderWrapperProps) {
	return (
		<header>
			<motion.div
				className="flex p-5 justify-between w-full"
				initial={{y: -100, opacity: 0}}
				animate={{y: 0, opacity: 1}}
				transition={{
					delay: 0.5,
				}}
			>
				{children}
			</motion.div>
		</header>
	)
}