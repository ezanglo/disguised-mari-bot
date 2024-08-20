"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { listItems } from "@/db/schema";
import { cn } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export type UpgradeType = InferSelectModel<typeof listItems>;

type UpgradeTypesSelectorProps = {
	data: UpgradeType[]
}

export function UpgradeTypesSelector({
	data
}: UpgradeTypesSelectorProps) {
	
	const router = useRouter();
	const searchParams = useSearchParams();
	const upgradeType = searchParams.get("upgradeType");
	
	const handleClick = (code?: string) => {
		const query = {upgradeType: code === upgradeType ? undefined : code}
		
		const url = qs.stringifyUrl({
			url: window.location.href,
			query
		}, {skipNull: true})
		
		router.push(url);
	}
	
	return (
		<div className="flex flex-row gap-2 p-2 flex-wrap">
			<Button
				variant="secondary" size="sm"
				className={cn(
					'bg-secondary/20',
					!upgradeType && 'bg-secondary/50 outline outline-2 outline-secondary'
				)}
				onClick={() => handleClick(undefined)}
			>
				All
			</Button>
			{data.map((item, index) => (
				<TooltipProvider key={index}>
					<Tooltip>
						<TooltipTrigger>
							<Button
								variant="secondary" size="sm"
								className={cn(
									'bg-secondary/20',
									item.code === upgradeType && 'bg-secondary/50 outline outline-2 outline-secondary'
								)}
								onClick={() => handleClick(item.code)}
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