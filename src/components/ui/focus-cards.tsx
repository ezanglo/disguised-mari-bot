"use client";
import { cn, hexToRgb } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

export const CardItem = React.memo(
	({
		card,
		index,
		hovered,
		setHovered,
	}: {
		card: any;
		index: number;
		hovered: number | null;
		setHovered: React.Dispatch<React.SetStateAction<number | null>>;
	}) => (
		<div
			onMouseEnter={() => setHovered(index)}
			onMouseLeave={() => setHovered(null)}
			className={cn(
				"rounded-lg relative overflow-hidden h-72 sm:h-80 md:h-96 w-full transition-all duration-300 ease-out",
				hovered !== null && hovered !== index && "blur-sm scale-[0.98] opacity-50",
			)}
			style={{
				backgroundColor: (hovered === index && card.color)
					? `rgba(${hexToRgb(card.color)}, 0.2)` // Add 50% opacity
					: 'transparent'
			}}
		>
			{card.src ? (
				<Image
					src={card.src}
					alt={card.title}
					fill
					className={cn(
						"object-cover absolute inset-0 scale-[2] origin-top transition-all duration-300",
						hovered === index && 'scale-[1]'
					)}
				/>
			) : card.icon && (
				<div className="flex flex-col gap-2 items-center justify-center size-full border">
					<Image
						src={card.icon}
						alt={card.title}
						height={50}
						width={50}
						className={cn(
							"rounded-lg object-cover inset-0 origin-top transition-all",
							hovered === index && 'scale-[1.7]'
						)}
					/>
					<span>{card.title}</span>
				</div>
			)}
			<div className={cn(
				"absolute bottom-0 left-0 flex flex-col gap-1 bg-background/50 w-full p-2",
				hovered === index ? "bg-background/90 " : "bg-background/50 "
			)}>
				<div className="flex items-center gap-1 w-full">
					<Image
						src={card.tierType || ""}
						alt={card.title} width={32} height={32}
						className="md:size-6 size-5"
					/>
					<Image
						src={card.classType || ""}
						alt={card.title} width={32} height={32}
						className="md:size-6 size-5"
					/>
					<Image
						src={card.attributeType || ""}
						alt={card.title} width={32} height={32}
						className="md:size-6 size-5"
					/>
				</div>
				<span className="font-semibold text-lg md:text-2xl">{card.title}</span>
			</div>
		</div>
	)
);

CardItem.displayName = "CardItem";

type Card = {
	title: string;
	src?: string;
	icon?: string;
	tierType?: string;
	classType?: string;
	attributeType?: string;
	color?: string;
};

export function FocusCards({ cards }: { cards: Card[] }) {
	const [hovered, setHovered] = useState<number | null>(null);

	return (
		<div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6 gap-4 mx-auto md:px-8 w-full max-w-6xl">
			{cards.map((card, index) => (
				<CardItem
					key={index}
					card={card}
					index={index}
					hovered={hovered}
					setHovered={setHovered}
				/>
			))}
		</div>
	);
}
