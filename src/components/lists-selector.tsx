"use client";

import { ListItemDialog } from "@/components/admin/settings/list-item-dialog";
import { ManageListGroup } from "@/components/admin/settings/manage-list-group";
import { Button } from "@/components/ui/button";
import { lists } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { cn } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export type ListGroupType = InferSelectModel<typeof lists> & {
	itemCount: number
};

export function ListsSelector() {
	const { data, isLoading} = useLists('list-group')

	const [listGroup, setListGroup] = useQueryState('list',
		parseAsString
			.withDefault('all')
			.withOptions({
				shallow: false,
				clearOnDefault: true,
			})
	)

	return (
		<div className="w-full flex gap-2 items-center flex-wrap justify-between">
			<div className="flex gap-2 items-center">
				<Button
					variant="secondary" size="sm"
					className={cn(
						'bg-secondary/20',
						listGroup === 'all' && 'bg-secondary/50 outline outline-2 outline-secondary'
					)}
					onClick={() => setListGroup('all')}
				>
					All
				</Button>
				{!isLoading && data.map((item: ListGroupType, index: number) => (
					<Button
						key={index} variant="secondary" size="sm"
						className={cn(
							'bg-secondary/20',
							item.name === listGroup && 'bg-secondary/50 outline outline-2 outline-secondary'
						)}
						onClick={() => setListGroup(item.name)}
					>
						{item.name}
					</Button>
				))}
			</div>
			{!isLoading && (
				<div className="flex gap-2 items-center">
				<ManageListGroup data={data} />
				<ListItemDialog>
					<Button variant="outline" size="icon" className="size-8">
						<PlusIcon className="size-4" />
					</Button>
				</ListItemDialog>
			</div>
			)}
		</div>
	)
}