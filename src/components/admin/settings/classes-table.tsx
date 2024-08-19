"use client";

import { deleteClassType } from "@/actions/class-type";
import { ClassDialog } from "@/components/admin/settings/class-dialog";
import { ColorPicker } from "@/components/color-picker";
import { CopyMarkdown } from "@/components/copy-markdown";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { classTypes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

type ClassesTableProps = {
	data: InferSelectModel<typeof classTypes>[]
}

export function ClassesTable({
	data
}: ClassesTableProps) {
	
	if (data.length === 0) {
		return (
			<div className="flex w-full items-center justify-center h-32 text-muted-foreground">
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
				{data.map((item, index) => (
					<TableRow key={index}>
						<TableCell className="font-medium hidden sm:table-cell">
							{item.id.split('-')[0]}
						</TableCell>
						<TableCell>
							<div className="flex flex-row gap-2 items-center">
								<Image src={item.image || ''} alt={item.name} width={100} height={100} className="size-5"/>
								{item.name}
							</div>
						</TableCell>
						<TableCell className="hidden md:table-cell">
							<ColorPicker value={item.color || ''} aria-readonly/>
						</TableCell>
						<TableCell>
							<div className="flex flex-row gap-2 items-center">
								<CopyMarkdown prefix="class" data={item}/>
								<span className="hidden sm:table-cell">{item.discordEmote}</span>
							</div>
						</TableCell>
						<TableCell className="text-right">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										aria-haspopup="true"
										size="icon"
										variant="ghost"
									>
										<MoreHorizontal className="h-4 w-4"/>
										<span className="sr-only">Toggle menu</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<ClassDialog data={item}>
										<DropdownMenuItem preventSelect>Edit</DropdownMenuItem>
									</ClassDialog>
									<ConfirmDialog
										title={`Delete ${item.name}?`}
										description="This action is permanent and cannot be undone."
										onConfirm={() => deleteClassType(item.id)}
									>
										<DropdownMenuItem preventSelect className="text-destructive">
											Delete
										</DropdownMenuItem>
									</ConfirmDialog>
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}