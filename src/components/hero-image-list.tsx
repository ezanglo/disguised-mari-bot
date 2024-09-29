import { HeroesType } from "@/components/admin/heroes/heroes-table";
import { UpgradeType } from "@/components/upgrade-types-selector";
import { DEFAULT_IMAGE } from "@/constants/constants";
import useLists from "@/hooks/use-lists";
import Image from "next/image";

type HeroImageListProps = {
	heroCodes: string[]
}

export function HeroImageList({
	heroCodes,
}: HeroImageListProps) {
	
	const {data, isLoading} = useLists('heroes')
	
	const heroes = !isLoading ? data.filter((i: UpgradeType) => {
		return heroCodes.includes(i.code);
	}): []
	
	return (
		<div className={"flex flex-row gap-2 flex-wrap"}>
			{heroes.map((item: HeroesType, index: number) => (
				<Image
					key={index}
					src={item.image || DEFAULT_IMAGE}
					alt={item.name} width={100} height={100}
					className="size-5"
				/>
			))}
		</div>
	)
}