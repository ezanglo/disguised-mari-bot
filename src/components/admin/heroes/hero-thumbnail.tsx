"use client";

import { updateHeroThumbnail } from "@/actions/hero";
import { HeroType } from "@/components/admin/heroes/heroes-table";
import { Button } from "@/components/ui/button";
import { WikiImageSelector } from "@/components/wiki-image-selector";
import { cn } from "@/lib/utils";
import { Loader2Icon, PlusIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type HeroThumbnailProps = {
	hero: HeroType,
}

export function HeroThumbnail({
	hero
}: HeroThumbnailProps) {
	
	const [value, setValue] = useState<string>(hero.thumbnail || '');
	const [pending, setPending] = useState(false);
	
	useEffect(() => {
		if(hero.thumbnail){
			setValue(hero.thumbnail); 
		}
	}, [hero.thumbnail]);
	
	const handleUpload = async (val: string) => {
		try {
			setPending(true);
			const result = await updateHeroThumbnail(hero, val)
			if (result) {
				toast.success("Hero thumbnail updated")
			}
		} catch (error) {
			toast.error((error as Error).message)
		} finally {
			setPending(false);
		}
	}
	
	return (
		<WikiImageSelector heroCode={hero.code} onSelect={handleUpload}>
			<Button
				disabled={pending}
				variant='ghost'
				className={cn(
					"h-72 w-52 text-muted-foreground p-0 overflow-hidden border border-dashed hover:border-0 relative",
					hero?.color && `hover:bg-[${hero.color}]`
				)}
			>
				{pending && (
					<div className="absolute inset-0 flex items-center justify-center z-10">
						<Loader2Icon className="animate-spin size-10"/>
					</div>
				)}
				{value ? (
					<Image
						src={value}
						alt={''}
						className={cn(
							"object-cover object-top w-full h-full scale-[2] transform origin-top",
							pending && "opacity-50"
						)}
						width={1000}
						height={1000}
					/>
				) : (
					<div className="flex flex-row items-center gap-2">
						<PlusIcon/>
						Add Thumbnail
					</div>
				)}
			</Button>
		</WikiImageSelector>
	)
}