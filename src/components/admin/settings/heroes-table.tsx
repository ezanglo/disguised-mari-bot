"use client";

import { deleteHero } from "@/actions/hero";
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
import { heroes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { AttributeType } from "../attribute-select";
import { ClassType } from "../class-select";
import { TierType } from "../tier-select";
import { HeroDialog } from "./hero-dialog";

export type HeroesType = InferSelectModel<typeof heroes>;

type HeroesTableProps = {
	data: (HeroesType & {
		tierImage?: string | null;
		classImage?: string | null;
		attributeImage?: string | null;
	})[],
	tierTypes: TierType[];
	classTypes: ClassType[];
	attributeTypes: AttributeType[];
}

export function HeroesTable({
	data,
	tierTypes,
	classTypes,
	attributeTypes
}: HeroesTableProps) {

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
					<TableHead>Tier</TableHead>
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
							<Image
								src={item.tierImage || ''}
								alt={item.tierType}
								width={100}
								height={100}
								className="size-5"
							/>
						</TableCell>
						<TableCell>
							<div className="flex flex-row gap-2 items-center">
								{item.image && (
									<Image src={item.image} alt={item.name} width={100} height={100} className="size-5" />
								)}
								{item.name}
								<Image
									src={item.classImage || ''}
									alt={item.classType}
									width={100}
									height={100}
									className="size-5"
								/>
								<Image
									src={item.attributeImage || ''}
									alt={item.attributeType}
									width={100}
									height={100}
									className="size-5"
								/>
							</div>
						</TableCell>
						<TableCell className="hidden md:table-cell">
							<CopyMarkdown prefix="hero" {...item} />
						</TableCell>
						<TableCell className="text-right">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
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
									<HeroDialog data={item}>
										<DropdownMenuItem preventSelect>Edit</DropdownMenuItem>
									</HeroDialog>
									<ConfirmDialog
										title={`Delete ${item.name}?`}
										description="This action is permanent and cannot be undone."
										onConfirm={() => deleteHero(item.id)}
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