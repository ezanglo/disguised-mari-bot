"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export function SearchFilter() {
	
	const [search, setSearch] = useQueryState('search',
		parseAsString
		.withDefault('')
		.withOptions({
			shallow: false,
			clearOnDefault: true,
			throttleMs: 1000
		})
	)
	
	return (
		<div className="relative w-full sm:w-auto">
			<SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
			<Input
				className="pl-8"
				value={search}
				onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
			/>
		</div>
)
}