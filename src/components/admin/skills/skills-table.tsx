"use client";

import { deleteSkill } from "@/actions/skill";
import { SkillDialog } from "@/components/admin/skills/skill-dialog";
import { CopyMarkdown } from "@/components/copy-markdown";
import { TableActions } from "@/components/table-actions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { skills } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Image from "next/image";

export type SkillType = InferSelectModel<typeof skills>;

type SkillsTableProps = {
	data: (SkillType & {
		heroImage: string | null
		upgradeName: string | null
		skillName: string | null
	})[],
}

export function SkillsTable({
	data,
}: SkillsTableProps) {

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
					<TableHead>Type</TableHead>
					<TableHead className="w-[25px] hidden sm:table-cell">Emote</TableHead>
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
							<div className="flex flex-row gap-2 items-center text-xs sm:text-base">
								{item.heroImage && <Image src={item.heroImage} alt={item.hero} width={100} height={100} className="size-5 rounded-sm" />}
								{item.image && <Image src={item.image} alt={item.name} width={100} height={100} className="size-5 rounded-sm" />}
								{item.name}
							</div>
						</TableCell>
						<TableCell>
							<div className="flex flex-row gap-2 flex-wrap">
								<Badge variant="outline">
									<span className="hidden sm:block">{item.skillName}</span>
									<span className="sm:hidden">{item.skillType}</span>
								</Badge>
								<Badge variant="outline">
									<span className="hidden sm:block">{item.upgradeName}</span>
									<span className="sm:hidden">{item.upgradeType}</span>
								</Badge>
							</div>
						</TableCell>
						<TableCell className="hidden sm:table-cell">
							<CopyMarkdown prefix="skill" {...item} name={item.upgradeType + item.code} />
						</TableCell>
						<TableCell className="text-right">
							<TableActions
								data={item}
								EditComponent={SkillDialog}
								onDelete={(data) => deleteSkill(data.id)}
								itemName={item.name}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}