"use client";

import { deleteMonster } from "@/actions/monster";
import { MonsterDialog } from "@/components/admin/monsters/monster-dialog";
import { CopyMarkdown } from "@/components/copy-markdown";
import { TableActions } from "@/components/table-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { monsters } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";

export type MonsterType = InferSelectModel<typeof monsters>;

type MonstersTableProps = {
	data: (MonsterType & {
		tierImage?: string | null;
		classImage?: string | null;
		attributeImage?: string | null;
	})[],
}

export function MonstersTable({
	data,
}: MonstersTableProps) {

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
								{item.image && (
									<Image src={item.image} alt={item.name} width={100} height={100} className="size-5" />
								)}
								{item.name}
								<Image
									src={item.classImage || ''}
									alt={item.classType || ''}
									width={100}
									height={100}
									className="size-5"
								/>
								<Image
									src={item.attributeImage || ''}
									alt={item.attributeType || ''}
									width={100}
									height={100}
									className="size-5"
								/>
							</div>
						</TableCell>
						<TableCell className="hidden md:table-cell">
							<CopyMarkdown prefix="mob" {...item} />
						</TableCell>
						<TableCell className="text-right">
							<TableActions
								data={item}
								EditComponent={MonsterDialog}
								onDelete={(data) => deleteMonster(data.id)}
								itemName={item.name}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}