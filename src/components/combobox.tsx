"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { DEFAULT_IMAGE } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { ChevronsUpDown, XIcon } from "lucide-react"
import Image from "next/image";
import * as React from "react";
import { useState, useEffect, useRef } from "react";

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
	trigger?: React.ReactNode,
}

export function Combobox({
	options,
	value,
	onValueChange,
	placeholder = "Select option",
	className,
	trigger,
}: ComboboxProps) {

	const [open, setOpen] = useState(false);

	const selected = options?.find((i) => i.value === value)
	const selectedItemRef = useRef<HTMLDivElement>(null);

	const handleSelect = (val: string) => {
		setOpen(false)
		onValueChange?.(value !== val ? val : undefined)
	}

	const scrollToSelectedItem = () => {
		if (selectedItemRef.current) {
			selectedItemRef.current.scrollIntoView({
				behavior: 'auto',
				block: 'center',
				inline: 'center'
			});
		}
	};

	useEffect(() => {
		if (open && value && options.length > 0) {
			// Use requestAnimationFrame to ensure the DOM has updated
			requestAnimationFrame(() => {
				scrollToSelectedItem();
			});
		}
	}, [open, value, options]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				{trigger || (
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
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<div className="relative">
						<CommandInput placeholder="Search..." className="pr-10" />
						<Button
							size="icon" variant="ghost"
							className="absolute right-0 top-1/2 -translate-y-1/2"
							onClick={() => handleSelect(value || '')}
						>
							<XIcon className="size-4" />
						</Button>
					</div>
					<CommandList className="max-h-48">
						<CommandEmpty>No data found.</CommandEmpty>
						<CommandGroup>
							{options.map((item, index) => (
								<CommandItem
									key={index}
									value={item.label}
									onSelect={() => handleSelect(item.value)}
									className={cn(item.value === value ? 'bg-primary/50' : '')}
								>
									<div
										className="flex flex-row gap-2 items-center w-full"
										ref={item.value === value ? selectedItemRef : null}
									>
										{item.image && (
											<Image
												src={item.image || DEFAULT_IMAGE}
												alt={item.value} width={100} height={100}
												className="size-5"
											/>
										)}
										{item.label}
										{item.value === value && (
											<CheckIcon className="ml-auto size-4" />
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
