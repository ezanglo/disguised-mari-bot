"use client";

import { ContentSelect } from "@/components/content-select";
import { parseAsString, useQueryState } from "nuqs";

export function ContentFilters() {
	const [contentType, setContentType] = useQueryState('contentType',
		parseAsString
		.withDefault('')
		.withOptions({
			shallow: false,
			clearOnDefault: true,
		})
	)
	
	return (
		<div className="flex flex-row gap-2">
			<ContentSelect
				value={contentType || 'all'}
				className="w-52"
				onValueChange={val => setContentType(val || '')}
			/>
		</div>
	)
}