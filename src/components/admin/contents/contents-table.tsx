"use client";

import { deleteContent } from "@/actions/content";
import { ContentDialog } from "@/components/admin/contents/content-dialog";
import { EnemyImageList } from "@/components/enemy-image-list";
import { Badge } from "@/components/ui/badge";
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
import { contentPhases } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

export type ContentType = InferSelectModel<typeof contentPhases>;

type ContentsTableProps = {
	data: (ContentType & {
		contentName: string | null,
		classImage?: string | null,
		attributeImage?: string | null,
	})[],
}

export function ContentsTable({
	data,
}: ContentsTableProps) {

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
					<TableHead>Content</TableHead>
					<TableHead className="w-[150px] hidden sm:table-cell">Enemies</TableHead>
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
							<Badge variant="outline" className="text-center">
								{item.contentName}
							</Badge>
						</TableCell>
						<TableCell className="space-y-2">
							<div className="flex flex-row gap-2 items-center">
								{item.classImage && (
									<Image src={item.classImage} alt={item.classImage} width={100} height={100} className="size-5" />
								)}
								{item.attributeImage && (
									<Image src={item.attributeImage} alt={item.attributeImage} width={100} height={100}
										className="size-5" />
								)}
								{item.name}
								<Badge variant="outline" className="hidden lg:block">
									{item.code}
								</Badge>
							</div>
							<div className="flex sm:hidden flex-row gap-2 items-center">
								<EnemyImageList codes={item.enemies || []} />
							</div>
						</TableCell>
						<TableCell className="w-[150px] hidden sm:table-cell">
							<div className="flex flex-row gap-2 items-center">
								<EnemyImageList codes={item.enemies || []} />
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
										<MoreHorizontal className="h-4 w-4" />
										<span className="sr-only">Toggle menu</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<ContentDialog data={item}>
										<DropdownMenuItem preventSelect>Edit</DropdownMenuItem>
									</ContentDialog>
									<ConfirmDialog
										title={`Delete ${item.name}?`}
										description="This action is permanent and cannot be undone."
										onConfirm={() => deleteContent(item.id)}
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