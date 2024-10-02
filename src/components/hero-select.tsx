"use client";

import { HeroType } from "@/components/admin/heroes/heroes-table";
import { DEFAULT_IMAGE } from "@/constants/constants";
import { listItems } from "@/db/schema";
import useLists from "@/hooks/use-lists";
import { cn } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export type ContentType = InferSelectModel<typeof listItems>;

type HeroSelectProps = {
	value?: string,
	onValueChange?: (value: string) => void,
	className?: string,
}

export function HeroSelect({
	value,
	onValueChange,
	className,
}: HeroSelectProps) {

	const { data, isLoading } = useLists('heroes')

	const [open, setOpen] = useState(false);

	const selected = data?.find((i: HeroType) => i.code === value)

	return !isLoading && (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					className={cn("w-full justify-between", className)}
				>
					{selected ? (
						<div className="flex flex-row gap-2">
							<Image
								src={selected.image || DEFAULT_IMAGE}
								alt={selected.name} width={100} height={100}
								className="size-5"
							/>
							{selected.name}
						</div>
					) : 'Select hero'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<CommandInput placeholder="Search..." />
					<CommandList className="max-h-48">
						<CommandEmpty>No data found.</CommandEmpty>
						<CommandGroup>
							{data.map((item: HeroType) => (
								<CommandItem
									key={item.code}
									value={item.name}
									onSelect={() => {
										setOpen(false)
										onValueChange?.(item.code)
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
	)
}