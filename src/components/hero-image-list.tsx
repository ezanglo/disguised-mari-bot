import { HeroType } from "@/components/admin/heroes/heroes-table";
import { UpgradeType } from "@/components/upgrade-types-selector";
import { DEFAULT_IMAGE } from "@/constants/constants";
import useLists from "@/hooks/use-lists";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type HeroImageListProps = {
	heroCodes: string[]
}

export function HeroImageList({
	heroCodes,
}: HeroImageListProps) {

	const { data, isLoading } = useLists('heroes')

	const heroes = !isLoading ? data.filter((i: UpgradeType) => {
		return heroCodes.includes(i.code);
	}) : []

	return (
		<div className={"flex flex-row gap-2 flex-wrap"}>
			{heroes.map((item: HeroType, index: number) => (
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