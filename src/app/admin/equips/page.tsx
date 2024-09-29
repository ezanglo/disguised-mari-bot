import { EquipDialog } from "@/components/admin/equips/equip-dialog";
import { EquipFilters } from "@/components/admin/equips/equip-filters";
import { EquipsTable } from "@/components/admin/equips/equips-table";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { classTypes, equipTypes, listItems } from "@/db/schema";
import { and, asc, eq, getTableColumns, inArray } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { createSearchParamsCache, parseAsArrayOf, parseAsString } from 'nuqs/server'

const searchParamsCache = createSearchParamsCache({
	classes: parseAsArrayOf(parseAsString),
	gearType: parseAsString
})

type EquipsPageProps = {
	searchParams: Record<string, string | string[] | undefined>
}

export default async function EquipsPage({
	searchParams
}: EquipsPageProps) {

	const { classes, gearType } = searchParamsCache.parse(searchParams)

	const whereConditions = []
	if (classes && classes.length > 0) {
		whereConditions.push(inArray(equipTypes.classType, classes))
	}
	if(gearType) {
		whereConditions.push(eq(equipTypes.gearType, gearType))
	}

	const items = await db
		.select({
			...getTableColumns(equipTypes),
			classImage: classTypes.image,
			className: classTypes.name,
			gearName: listItems.name,
		}).from(equipTypes)
		.leftJoin(classTypes, eq(equipTypes.classType, classTypes.code))
		.leftJoin(listItems, eq(equipTypes.gearType, listItems.code))
		.where(and(...whereConditions))
		.orderBy(asc(equipTypes.classType), asc(listItems.order));

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 h-full mb-4 overflow-hidden">
			<div className="flex items-center gap-2">
				<h1 className="text-lg font-semibold md:text-2xl">Equips</h1>
				<EquipDialog>
					<Button variant={'secondary'} size={'icon'} className="size-5 rounded-full">
						<PlusIcon className="size-3" />
					</Button>
				</EquipDialog>
			</div>
			<EquipFilters/>
			<div className="flex-1 rounded-lg border border-dashed shadow-sm p-2 md:p-3 overflow-y-auto">
				<EquipsTable data={items}/>
			</div>
		</div>
	)
}