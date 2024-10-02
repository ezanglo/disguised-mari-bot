"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { DEFAULT_IMAGE } from "@/constants/constants";
import { enemyTypeEnum } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { ChevronsUpDown, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HeroType } from "./admin/heroes/heroes-table";
import { MonsterType } from "./admin/monsters/monster-table";

type EnemySelectorProps = {
	enemyType?: typeof enemyTypeEnum.enumValues[number] | null;
	value?: string[],
	onValueChange?: (val?: string[]) => void
}

type Enemy = {
	code: string,
	name: string,
	image: string | null
}

export function EnemySelector({
	enemyType,
	value = [],
	onValueChange
}: EnemySelectorProps) {

	const [enemies, setEnemies] = useState<Enemy[]>([]);
	const [open, setOpen] = useState(false);

	const {data: heroList} = useLists('heroes');
	const {data: monsterList} = useLists('monsters');
	const data = enemyType === 'heroes' ? heroList: monsterList
	
	useEffect(() => {
		const newEnemies = value.map(code => {
			const enemy = data.find((e: HeroType | MonsterType) => e.code === code);
			return enemy || { code, name: code, image: '' };
		});
		setEnemies(newEnemies);
	}, [value, data]);

	const handleRemove = (index: number) => {
		const newValues = [...value];
		newValues.splice(index, 1);
		onValueChange?.(newValues);
	};

	const handleSelect = (enemy?: MonsterType | HeroType) => {
		if(!enemy) return;
		const { code, name, image } = enemy;

		if (!value.includes(code)) {
			onValueChange?.([...value, code]);
			setEnemies(prev => [...prev, { code, name, image }]);
		}
	}

	const getEnemy = (code: string) => {
		return [...monsterList || [], ...heroList || []].find(i => i.code === code)
	}
	
	return (
		<div className="flex flex-col gap-2">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						className="justify-between"
					>
						{'Select enemy'}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-0">
					<Command>
						<CommandInput placeholder="Search..." />
						<CommandList className="max-h-48">
							<CommandEmpty>No data found.</CommandEmpty>
							<CommandGroup>
								{data.map((item: HeroType | MonsterType) => (
									<CommandItem
										key={item.code}
										value={item.name}
										onSelect={() => {
											setOpen(false)
											handleSelect(item)
										}}
									>
										<div className="flex flex-row gap-2">
											<Image
												src={item.image || DEFAULT_IMAGE}
												alt={item.name} width={100} height={100}
												className="size-5"
											/>
											{item.name}
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<div className="flex flex-row gap-2 flex-wrap">
				{enemies?.map((item, index) => (
					<Badge key={index} variant="secondary" className="flex flex-row gap-1 items-center justify-center p-0">
						<Image
							src={getEnemy(item.code)?.image || DEFAULT_IMAGE}
							alt={getEnemy(item.code)?.name} width={100} height={100}
							className="size-5"
						/>
						<XIcon
							className="size-3 cursor-pointer"
							onClick={() => handleRemove(index)}
						/>
					</Badge>
				))}
			</div>
		</div>
	)
}