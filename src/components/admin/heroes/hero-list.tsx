import { Card, CardHeader } from '@/components/ui/card'
import { DEFAULT_IMAGE } from '@/constants/constants'
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { attributeTypes, classTypes, heroes, tierTypes } from "@/db/schema";
import { cn } from "@/lib/utils";
import { and, asc, eq, getTableColumns, inArray } from "drizzle-orm";
import Image from 'next/image'
import Link from "next/link";
import React from 'react'

type HeroListProps = {
	tiers?: string[] | null,
	classes?: string[] | null,
	attributes?: string[] | null,
	className?: string,
}

export async function HeroList({
	tiers,
	classes,
	attributes,
	className
}: HeroListProps) {
	const whereConditions = []
	
	if (tiers && tiers.length > 0) {
		whereConditions.push(inArray(heroes.tierType, tiers))
	}
	if (classes && classes.length > 0) {
		whereConditions.push(inArray(heroes.classType, classes))
	}
	if (attributes && attributes.length > 0) {
		whereConditions.push(inArray(heroes.attributeType, attributes))
	}
	
	const data = await db
	.select({
		...getTableColumns(heroes),
		tierImage: tierTypes.image,
		classImage: classTypes.image,
		attributeImage: attributeTypes.image,
	}).from(heroes)
	.leftJoin(tierTypes, eq(heroes.tierType, tierTypes.code))
	.leftJoin(classTypes, eq(heroes.classType, classTypes.code))
	.leftJoin(attributeTypes, eq(heroes.attributeType, attributeTypes.code))
	.where(and(...whereConditions))
	.orderBy(asc(heroes.createdAt));
	
	
	return (
		<div className={cn("flex flex-wrap gap-2 md:gap-3", className)}>
			{data.map((item, index) => (
				<Link key={index} href={ROUTES.ADMIN.HEROES.HERO(item.code)}>
					<Card className="overflow-hidden hover:scale-105 transition-all duration-300">
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
