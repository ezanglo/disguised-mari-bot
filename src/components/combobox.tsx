"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { ChevronsUpDown } from "lucide-react"
import * as React from "react"

type Option = {
	label: string
	value: string
}

type ComboboxProps = {
	options: Option[]
	value?: string,
	onSelect?: (val: string) => void
	placeholder?: string
}

export function Combobox({
	options,
	value,
	onSelect,
	placeholder = "Select option",
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false)

	const selected = options.find(i => i.value == value);
	
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between w-full"
				>
					{selected?.label || placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<CommandInput placeholder="Search..." />
					<CommandList className="max-h-48">
						<CommandEmpty>No data found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.label}
									onSelect={(value) => {
										setOpen(false)
										onSelect?.(option.value)
									}}
								>
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
