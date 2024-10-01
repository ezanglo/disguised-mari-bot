import { MonsterDialog } from "@/components/admin/monsters/monster-dialog";
import { MonsterList } from "@/components/admin/monsters/monster-list";
import { MonsterListFilters } from "@/components/admin/monsters/monster-list-filters";
import LoadingPlaceholder from "@/components/loading-placeholder";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { createSearchParamsCache, parseAsArrayOf, parseAsString } from 'nuqs/server'
import { Suspense } from "react";

const searchParamsCache = createSearchParamsCache({
	classes: parseAsArrayOf(parseAsString),
	attributes: parseAsArrayOf(parseAsString),
})


type MonstersPageProps = {
	searchParams: Record<string, string | string[] | undefined>
}

export default async function MonstersPage({
	searchParams
}: MonstersPageProps) {

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 h-full mb-4 overflow-hidden">
			<div className="flex items-center gap-2">
				<h1 className="text-lg font-semibold md:text-2xl">Monsters</h1>
				<MonsterDialog>
					<Button variant={'secondary'} size={'icon'} className="size-5 rounded-full">
						<PlusIcon className="size-3" />
					</Button>
				</MonsterDialog>
			</div>
			<MonsterListFilters />
			<div className="flex-1 rounded-lg border border-dashed shadow-sm p-2 md:p-3 overflow-y-auto">
				<Suspense fallback={<LoadingPlaceholder/>}>
					<MonsterList {...searchParamsCache.parse(searchParams)} />
				</Suspense>
			</div>
		</div>
	)
}