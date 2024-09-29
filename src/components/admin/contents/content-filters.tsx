"use client";

import { ContentSelect } from "@/components/content-select";
import { parseAsString, useQueryState } from "nuqs";

export function ContentFilters() {
	const [contentType, setContentType] = useQueryState('contentType',
		parseAsString
		.withDefault('all')
		.withOptions({
			shallow: false,
			clearOnDefault: true,
		})
	)
	
	return (
		<div className="flex flex-row gap-2">
			<ContentSelect
				showAll
				defaultValue={contentType || 'all'}
				className="w-52"
				onValueChange={setContentType}
			/>
		</div>
	)
}