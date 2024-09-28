import { Card, CardHeader } from '@/components/ui/card'
import { DEFAULT_IMAGE } from '@/constants/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { HeroesType } from '../settings/heroes-table'

type HeroListProps = {
	data: (HeroesType & {
		tierImage?: string | null;
		classImage?: string | null;
		attributeImage?: string | null;
	})[],
}

export function HeroList({ data }: HeroListProps) {
	return (
		<div className="flex flex-wrap gap-2 md:gap-3">
			{data.map((item, index) => (
				<Link href={`/admin/heroes/${item.id}`} key={index}>
					<Card key={index} className="overflow-hidden hover:scale-105 transition-all duration-300">
						<CardHeader className="p-0 space-y-0 relative">
							<Image
								src={item.image || DEFAULT_IMAGE}
								className="size-[4.5rem] md:size-24 object-cover"
								alt={item.displayName} width={500} height={500}
							/>
							<div className="absolute top-0 left-0 flex items-center gap-1 bg-background/50 w-full p-1">
								<Image
									src={item.tierImage || ""}
									alt={item.displayName} width={32} height={32}
									className="size-4"
								/>
								<span className="text-xs font-semibold">{item.name}</span>
							</div>
							<div className="flex items-center gap-1 absolute bottom-0 right-0 w-full p-1">
								<Image
									src={item.classImage || ""}
									alt={item.displayName} width={32} height={32}
									className="size-5"
								/>
								<Image
									src={item.attributeImage || ""}
									alt={item.displayName} width={32} height={32}
									className="size-5"
								/>
							</div>
						</CardHeader>
					</Card>
				</Link>
			))}
		</div>
	)
}
