"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { DEFAULT_IMAGE } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { ChevronsUpDown } from "lucide-react"
import Image from "next/image";
import * as React from "react";
import { useState } from "react";

type Option = {
	label: string,
	value: string,
	image?: string,
}

type ComboboxProps = {
	options: Option[]
	value?: string,
	onValueChange?: (val?: string) => void
	placeholder?: string
	className?: string,
}

export function Combobox({
	options,
	value,
	onValueChange,
	placeholder = "Select option",
	className,
}: ComboboxProps) {
	
	const [open, setOpen] = useState(false);
	
	const selected = options?.find((i) => i.value === value)
	
	const handleSelect = (val: string) => {
		setOpen(false)
		console.log({val})
		onValueChange?.(value !== val ? val : undefined)
	}
	
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					className={cn("w-full justify-between", className)}
				>
					<div className="flex flex-row gap-2">
						{selected?.image && (
							<Image
								src={selected.image || DEFAULT_IMAGE}
								alt={selected.value} width={100} height={100}
								className="size-5"
							/>
						)}
						{selected?.label || placeholder}
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<CommandInput placeholder="Search..."/>
					<CommandList className="max-h-48">
						<CommandEmpty>No data found.</CommandEmpty>
						<CommandGroup>
							{options.map((item) => (
								<CommandItem
									key={item.value}
									value={item.label}
									onSelect={() => handleSelect(item.value)}
								>
									<div className="flex flex-row gap-2 items-center w-full">
										{item.image && (
											<Image
												src={item.image || DEFAULT_IMAGE}
												alt={item.value} width={100} height={100}
												className="size-5"
											/>
										)}
										{item.label}
										{item.value === value && (
											<CheckIcon className="ml-auto size-4"/>
										)}
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
