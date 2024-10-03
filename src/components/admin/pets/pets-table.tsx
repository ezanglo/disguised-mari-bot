"use client";

import { deletePet } from "@/actions/pet";
import { PetDialog } from "@/components/admin/pets/pet-dialog";
import { CopyMarkdown } from "@/components/copy-markdown";
import { TableActions } from "@/components/table-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { pets } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
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
								{item.heroImage && <Image src={item.heroImage} alt={item.name} width={100} height={100} className="size-5" />}
							</div>
						</TableCell>
						<TableCell className="hidden md:table-cell">
							<CopyMarkdown prefix="pet" {...item} />
						</TableCell>
						<TableCell className="text-right items-center">
							<TableActions
								data={item}
								EditComponent={PetDialog}
								onDelete={(data) => deletePet(data.id)}
								itemName={item.name}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}