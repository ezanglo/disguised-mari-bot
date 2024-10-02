"use client";

import { Combobox } from "@/components/combobox";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_IMAGE } from "@/constants/constants";
import { enemyTypeEnum } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { XIcon } from "lucide-react";
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
	label: string,
	value: string,
	image?: string,
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
	const data = enemyType === 'heroes' ? heroList : monsterList
	
	const options = data.map((item: MonsterType | HeroType) => ({
		label: item.name,
		value: item.code,
		image: item.image,
	}))
	
	useEffect(() => {
		const newEnemies = value.map(code => {
			const enemy = data.find((e: HeroType | MonsterType) => e.code === code);
			return enemy || {code, name: code, image: ''};
		});
		setEnemies(newEnemies);
	}, [value, data]);
	
	const handleRemove = (index: number) => {
		const newValues = [...value];
		newValues.splice(index, 1);
		onValueChange?.(newValues);
	};
	
	const handleSelect = (selected?: string) => {
		const enemy = options.find((i: Enemy) => i.value === selected);
		if (enemy) {
			if (!value.includes(enemy.value)) {
				onValueChange?.([...value, enemy.value]);
				setEnemies(prev => [...prev, enemy]);
			}
		}
	}
	
	return (
		<div className="flex flex-col gap-2">
			<Combobox
				placeholder="Select enemy"
				options={options}
				onValueChange={handleSelect}
			/>
			<div className="flex flex-row gap-2 flex-wrap">
				{enemies?.map((item, index) => (
					<Badge key={index} variant="secondary" className="flex flex-row gap-1 items-center justify-center p-0">
						<Image
							src={item.image || DEFAULT_IMAGE}
							alt={item.label} width={100} height={100}
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