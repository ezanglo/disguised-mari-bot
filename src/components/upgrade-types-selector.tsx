"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { cn } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { parseAsString, useQueryState } from "nuqs";

export type UpgradeType = InferSelectModel<typeof listItems>;

export function UpgradeTypesSelector() {

	const { data, isLoading} = useLists('upgrade-types')
	
	const [upgradeType, setUpgradeType] = useQueryState('upgradeType',
		parseAsString
			.withDefault('all')
			.withOptions({
				shallow: false,
				clearOnDefault: true,
			})
	)

	const upgradeTypes = !isLoading ? data.filter((i: UpgradeType) => {
		return ['lvl', 'csr', 'si', 'trans'].includes(i.code);
	}): []
	
	return (
		<div className="flex flex-row gap-2 flex-wrap">
			<Button
				variant="secondary" size="sm"
				className={cn(
					'bg-secondary/20',
					upgradeType === 'all' && 'bg-secondary/50 outline outline-2 outline-secondary'
				)}
				onClick={() => setUpgradeType('all')}
			>
				All
			</Button>
			{upgradeTypes.map((item: UpgradeType, index: number) => (
				<TooltipProvider key={index}>
					<Tooltip>
						<TooltipTrigger>
							<Button
								variant="secondary" size="sm"
								className={cn(
									'bg-secondary/20',
									item.code === upgradeType && 'bg-secondary/50 outline outline-2 outline-secondary'
								)}
								onClick={() => setUpgradeType(item.code)}
							>
								{item.name}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{item.name}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			))}
		</div>
	)
}