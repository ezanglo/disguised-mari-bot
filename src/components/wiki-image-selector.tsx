"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { GalleryType } from "@/lib/wiki-helper";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";

type WikiImageSelectorProps = {
	heroCode: string,
	children: React.ReactNode,
	onSelect?: (image: string) => void,
}

export function WikiImageSelector({
	heroCode,
	children,
	onSelect
}: WikiImageSelectorProps) {
	
	const [open, setOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState('');
	
	const {data, isLoading} = useQuery({
		queryKey: ['wiki-heroes', heroCode],
		queryFn: () => fetch(`/api/wiki/heroes/${heroCode.replace('_','/')}`).then(res => res.json()),
	});
	
	const gallery: GalleryType = !isLoading ? data?.gallery || {} : {}
	
	const tabs = Object.keys(gallery);
	
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>
			<DialogContent className="w-[800px]">
				<Tabs>
					<TabsList>
						{tabs.map(tab => (
							<TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
						))}
					</TabsList>
					{tabs.map(tab => (
						<TabsContent key={tab} value={tab}>
							<div className="flex flex-row flex-wrap gap-3 h-[400px] overflow-y-auto">
								{gallery[tab].filter(i => i.image).map((image, index) => (
									<Button
										key={index}
										variant="outline"
										className={cn(
											"w-[100px] h-[150px] overflow-hidden",
											selectedImage === image.image && "bg-muted-foreground"
										)}
										onClick={() => setSelectedImage(image.image)}
									>
										<Image
											src={`${image.image}/revision/latest/scale-to-width-down/300`}
											alt={''}
											className="object-cover w-full h-full "
											width={500}
											height={500}
										/>
									</Button>
								))}
							</div>
						</TabsContent>
					))}
				</Tabs>
				<DialogFooter>
					<Button onClick={() => {
						onSelect?.(selectedImage)
						setOpen(false)
					}}>Select</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}