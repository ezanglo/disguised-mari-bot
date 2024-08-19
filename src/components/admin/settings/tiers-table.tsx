"use client";

import { deleteTierType } from "@/actions/tier-type";
import { TierDialog } from "@/components/admin/settings/tier-dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { tierTypes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { EditIcon, TrashIcon } from "lucide-react";
import Image from "next/image";

type TiersTableProps = {
	data: InferSelectModel<typeof tierTypes>[]
}

export function TiersTable({
	data
}: TiersTableProps) {
	
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
					<TableHead className="w-[100px] hidden sm:table-cell md:hidden lg:table-cell">ID</TableHead>
					<TableHead>Name</TableHead>
					<TableHead className="hidden sm:table-cell md:hidden lg:table-cell">Discord Emote</TableHead>
					<TableHead></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((item, index) => (
					<TableRow key={index}>
						<TableCell
							className="font-medium hidden sm:table-cell md:hidden lg:table-cell">{item.id.split('-')[0]}</TableCell>
						<TableCell>
							<div className="flex flex-row gap-2 items-center">
								<Image src={item.image || ''} alt={item.name} width={100} height={100} className="size-5"/>
								{item.name}
							</div>
						</TableCell>
						<TableCell className="hidden sm:table-cell md:hidden lg:table-cell">{item.discordEmote}</TableCell>
						<TableCell className="text-right">
							<TierDialog data={item}>
								<Button variant="ghost" size="icon">
									<EditIcon className="size-4"/>
								</Button>
							</TierDialog>
							<ConfirmDialog
								title={`Delete ${item.name}?`}
								description="This action is permanent and cannot be undone."
								onConfirm={() => deleteTierType(item.id)}
							>
								<Button variant="ghost" size="icon">
									<TrashIcon className="size-4 text-destructive"/>
								</Button>
							</ConfirmDialog>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}