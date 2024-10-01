import { DEFAULT_IMAGE } from "@/constants/constants";
import useLists from "@/hooks/use-lists";
import Image from "next/image";
import { HeroType } from "./admin/heroes/heroes-table";
import { MonsterType } from "./admin/monsters/monster-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type EnemyImageListProps = {
	codes: string[]
}

export function EnemyImageList({
	codes,
}: EnemyImageListProps) {

	const {data: heroList } = useLists('heroes');
	const {data: monsterList } = useLists('monsters');

	const data = [...heroList || [], ...monsterList || []]

	const enemies = data.filter(i => codes.includes(i.code)) 

	return (
		<div className={"flex flex-row gap-2 flex-wrap"}>
			{enemies.map((item: HeroType | MonsterType, index) => (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Image
								key={index}
								src={item.image || DEFAULT_IMAGE}
								alt={item.name} width={100} height={100}
								className="size-5"
							/>
						</TooltipTrigger>
						<TooltipContent className="flex flex-col items-center justify-center">
							{item.name}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			))}
		</div>
	)
}