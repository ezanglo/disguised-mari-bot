import { ContentDialog } from "@/components/admin/contents/content-dialog";
import { ContentFilters } from "@/components/admin/contents/content-filters";
import { ContentsTable } from "@/components/admin/contents/contents-table";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { attributeTypes, classTypes, contentPhases, listItems } from "@/db/schema";
import { and, asc, eq, getTableColumns } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

const searchParamsCache = createSearchParamsCache({
	contentType: parseAsString
})

type ContentsPageProps = {
	searchParams: Record<string, string | string[] | undefined>
}

export default async function ContentsPage({
	searchParams
}: ContentsPageProps) {
	
	const { contentType } = searchParamsCache.parse(searchParams)
	
	const whereConditions = []
	if(contentType) {
		whereConditions.push(eq(contentPhases.content, contentType))
	}
	
	const items = await db
	.select({
		...getTableColumns(contentPhases),
		contentName: listItems.name,
		classImage: classTypes.image,
		attributeImage: attributeTypes.image,
	}).from(contentPhases)
	.leftJoin(listItems, eq(contentPhases.content, listItems.code))
	.leftJoin(classTypes, eq(contentPhases.classType, classTypes.code))
	.leftJoin(attributeTypes, eq(contentPhases.attributeType, attributeTypes.code))
	.where(and(...whereConditions))
	.orderBy(asc(contentPhases.content), asc(contentPhases.code));
	
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 h-full mb-4">
			<div className="flex items-center gap-2">
				<h1 className="text-lg font-semibold md:text-2xl">Contents</h1>
				<ContentDialog>
					<Button variant={'secondary'} size={'icon'} className="size-5 rounded-full">
						<PlusIcon className="size-3"/>
					</Button>
				</ContentDialog>
			</div>
			<ContentFilters/>
			<div className="flex-1 rounded-lg border border-dashed shadow-sm p-2 md:p-3 overflow-y-auto">
				<ContentsTable data={items}/>
			</div>
		</div>
	)
}