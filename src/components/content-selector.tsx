"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { cn } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { parseAsString, useQueryState } from "nuqs";

export type ContentType = InferSelectModel<typeof listItems>;

export function ContentTypesSelector() {

	const { data, isLoading} = useLists('content-types')
	
	const [contentType, setContentType] = useQueryState('contentType',
		parseAsString
			.withDefault('all')
			.withOptions({
				shallow: false,
				clearOnDefault: true,
			})
	)
	
	return (
		<div className="flex flex-row gap-2 flex-wrap">
			<Button
				variant="secondary" size="sm"
				className={cn(
					'bg-secondary/20',
					contentType === 'all' && 'bg-secondary/50 outline outline-2 outline-secondary'
				)}
				onClick={() => setContentType('all')}
			>
				All
			</Button>
			{!isLoading && data.map((item: ContentType, index: number) => (
				<TooltipProvider key={index}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="secondary" size="sm"
								className={cn(
									'bg-secondary/20',
									item.code === contentType && 'bg-secondary/50 outline outline-2 outline-secondary'
								)}
								onClick={() => setContentType(item.code)}
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