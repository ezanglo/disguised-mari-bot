import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_IMAGE } from "@/constants/constants";
import { db } from "@/db";
import { attributeTypes, classTypes, heroes, tierTypes } from "@/db/schema";
import { asc, eq, getTableColumns } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export default async function HeroesPage() {
	
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
		.orderBy(asc(heroes.createdAt));

	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			<h1 className="text-lg font-semibold md:text-2xl">Heroes</h1>
			<div
				className="flex flex-wrap rounded-lg border border-dashed shadow-sm size-full p-3 gap-3"
			>
				{data.map((item, index) => (
					<Link href={`/admin/heroes/${item.id}`} key={index}>
						<Card key={index} className="overflow-hidden hover:scale-105 transition-all duration-300">
							<CardHeader className="p-0 space-y-0 relative">
								<Image 
									src={item.image || DEFAULT_IMAGE} 
									className="size-24 object-cover"
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
		</main>
	)
}