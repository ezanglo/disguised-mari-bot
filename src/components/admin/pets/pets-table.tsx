"use client";

import { deletePet } from "@/actions/pet";
import { PetDialog } from "@/components/admin/pets/pet-dialog";
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
import { pets } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import Image from "next/image";

export type PetType = InferSelectModel<typeof pets>;

type PetsTableProps = {
	data: (PetType & {
		heroImage: string | null,
		tierImage: string | null,
		classImage: string | null,
		attributeImage: string | null
	})[],
}

export function PetsTable({
	data,
}: PetsTableProps) {

	if (data.length === 0) {
		return (
			<div
				className="flex w-full items-center justify-center h-32 text-muted-foreground border border-muted rounded-md">
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
					<TableHead>Hero</TableHead>
					<TableHead className="hidden md:table-cell">Emote</TableHead>
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
								<Image
									src={item.tierImage || ''}
									alt={item.name}
									width={100}
									height={100}
									className="size-5"
								/>
								<Image
									src={item.image || ''}
									alt={item.name}
									width={100}
									height={100}
									className="size-5"
								/>
								{item.name}
							</div>
						</TableCell>
						<TableCell>
							<div className="flex flex-row gap-2 items-center">
								<Image
									src={item.classImage || ''}
									alt={item.name}
									width={100}
									height={100}
									className="size-5"
								/>
								<Image
									src={item.attributeImage || ''}
									alt={item.name}
									width={100}
									height={100}
									className="size-5"
								/>
								{item.heroImage && (
									<Image src={item.heroImage} alt={item.name} width={100} height={100} className="size-5" />
								)}
							</div>
						</TableCell>
						<TableCell className="hidden md:table-cell">
							<CopyMarkdown prefix="pet" {...item} />
						</TableCell>
						<TableCell className="text-right items-center">
							<div className="flex flex-row gap-2 justify-end">
								<PetDialog data={item}>
									<Button variant="ghost" size="icon">
										<PencilIcon className="size-3"/>
									</Button>
								</PetDialog>
								<ConfirmDialog
									title={`Delete ${item.name}?`}
									description="This action is permanent and cannot be undone."
									onConfirm={() => deletePet(item.id)}
								>
									<Button variant="ghost" size="icon" className="text-destructive">
										<TrashIcon className="size-3"/>
									</Button>
								</ConfirmDialog>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild className="block sm:hidden">
									<Button
										aria-haspopup="true"
										size="icon"
										variant="ghost"
									>
										<MoreHorizontal className="h-4 w-4" />
										<span className="sr-only">Toggle menu</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<PetDialog data={item}>
										<DropdownMenuItem preventSelect>Edit</DropdownMenuItem>
									</PetDialog>
									<ConfirmDialog
										title={`Delete ${item.name}?`}
										description="This action is permanent and cannot be undone."
										onConfirm={() => deletePet(item.id)}
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