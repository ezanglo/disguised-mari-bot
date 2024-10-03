"use client";

import { deleteClassType } from "@/actions/class-type";
import { ClassDialog } from "@/components/admin/settings/class-dialog";
import { ColorPicker } from "@/components/color-picker";
import { CopyMarkdown } from "@/components/copy-markdown";
import { TableActions } from "@/components/table-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_IMAGE } from "@/constants/constants";
import { classTypes } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";

type ClassType = InferSelectModel<typeof classTypes>;

export function ClassesTable() {

	const { data, isLoading} = useLists('classes')

	if(isLoading) {
		return (
			<div className="flex w-full items-center justify-center h-32 text-muted-foreground border border-muted rounded-md">
				Loading...
			</div>
		)
	}
	
	if (data.length === 0) {
		return (
			<div className="flex w-full items-center justify-center h-32 text-muted-foreground border border-muted rounded-md">
				No data found.
			</div>
		)
	}
	
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px] hidden sm:table-cell">ID</TableHead>
					<TableHead>Name</TableHead>
					<TableHead className="hidden md:table-cell">Color</TableHead>
					<TableHead>Emote</TableHead>
					<TableHead>
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((item: ClassType, index: number) => (
					<TableRow key={index}>
						<TableCell className="font-medium hidden sm:table-cell">
							{item.id.split('-')[0]}
						</TableCell>
						<TableCell>
							<div className="flex flex-row gap-2 items-center">
								{item.image && <Image src={item.image || DEFAULT_IMAGE} alt={item.name} width={100} height={100} className="size-5"/>}
								{item.name}
							</div>
						</TableCell>
						<TableCell className="hidden md:table-cell">
							<ColorPicker value={item.color || ''} aria-readonly/>
						</TableCell>
						<TableCell>
							<CopyMarkdown prefix="class" {...item}/>
						</TableCell>
						<TableCell className="text-right">
							<TableActions
								data={item}
								EditComponent={ClassDialog}
								onDelete={(data) => deleteClassType(data.id)}
								itemName={item.name}
								revalidateQuery="classes"
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}