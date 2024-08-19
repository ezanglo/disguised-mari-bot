"use client";

import { ManageListGroup } from "@/components/admin/settings/manage-list-group";
import { Button } from "@/components/ui/button";
import { lists } from "@/db/schema";
import { cn } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export type ListGroupType = InferSelectModel<typeof lists> & {
	itemCount: number
};

type ListsSelectorProps = {
	data: ListGroupType[]
}

export function ListsSelector({
	data
}: ListsSelectorProps) {
	
	const router = useRouter();
	const searchParams = useSearchParams();
	const listId = searchParams.get("listId");
	
	const handleClick = (id?: string) => {
		const query = {listId: id === listId ? undefined : id}
		
		const url = qs.stringifyUrl({
			url: window.location.href,
			query
		}, {skipNull: true})
		
		router.push(url);
	}
	
	return (
		<div className="flex flex-row gap-1 py-2">
			<div className="flex gap-1 py-1">
				<ManageListGroup data={data}/>
				<Button
					variant="secondary" size="sm"
					className={cn(
						'bg-secondary/20',
						!listId && 'bg-secondary/50 outline outline-2 outline-secondary'
					)}
					onClick={() => handleClick(undefined)}
				>
					All
				</Button>
			</div>
			<div className="w-full overflow-x-auto flex gap-1 flex-1 p-1">
				{data.map((item, index) => (
					<Button
						key={index} variant="secondary" size="sm"
						className={cn(
							'bg-secondary/20',
							item.id === listId && 'bg-secondary/50 outline outline-2 outline-secondary'
						)}
						onClick={() => handleClick(item.id)}
					>
						{item.name}
					</Button>
				))}
			</div>
		</div>
	)
}