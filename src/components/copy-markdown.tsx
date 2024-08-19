"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { attributeTypes, classTypes, tierTypes } from "@/db/schema";
import { GetDiscordEmoteName } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

type CopyMarkdownProps = {
	prefix: 'tier',
	data: InferSelectModel<typeof tierTypes>
} | {
	prefix: 'class',
	data: InferSelectModel<typeof classTypes>
} | {
	prefix: 'attr',
	data: InferSelectModel<typeof attributeTypes>
}

export function CopyMarkdown({
	prefix,
	data
}: CopyMarkdownProps) {
	
	const handleCopy = async () => {
		const label = GetDiscordEmoteName(prefix, data.name, data.id)
		const markdown = `<:${label}:${data.discordEmote}>`
		
		navigator.clipboard.writeText(markdown).then(() => {
			toast.success('Markdown copied to clipboard', {
				position: 'bottom-center',
			});
		})
	}
	
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Button variant="ghost" size="icon" onClick={handleCopy}>
						<CopyIcon className="size-4"/>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Copy markdown</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}