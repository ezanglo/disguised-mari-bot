"use client";

import { HeroSelect } from "@/components/hero-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { enemyTypeEnum } from "@/db/schema";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";

type EnemySelectorProps = {
	enemyType?: typeof enemyTypeEnum.enumValues[number] | null;
	value?: string[],
	onValueChange?: (val?: string[]) => void
}

export function EnemySelector({
	enemyType,
	value = [],
	onValueChange
}: EnemySelectorProps) {
	
	const [enemy, setEnemy] = useState<string>('');
	
	const handleRemove = (index: number) => {
		const newValues = [...value];
		newValues.splice(index, 1);
		onValueChange?.(newValues);
	};
	
	return (
		<div className="flex flex-col gap-2">
			{enemyType === 'heroes' ? (
				<HeroSelect onValueChange={val => {
					val && !value.includes(val) && onValueChange?.([...value, val])
				}}/>
			) : (
				<div className="flex items-center gap-2">
					<Input
						className="flex-1"
						value={enemy}
						onChange={e => setEnemy(e.target.value)}
					/>
					<Button
						size="icon"
						variant="secondary"
						onClick={(e) => {
							e.preventDefault();
							setEnemy('');
							enemy && !value.includes(enemy) && onValueChange?.([...value, enemy])
						}}
					>
						<PlusIcon className="size-4"/>
					</Button>
				</div>
			)}
			<div className="flex flex-row gap-2 flex-wrap">
				{value?.map((item, index) => (
					<Badge key={index} variant="secondary" className="flex flex-row gap-1 items-center justify-center">
						<span>{item}</span>
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