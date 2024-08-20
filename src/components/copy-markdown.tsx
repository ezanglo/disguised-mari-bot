"use client";

import { ClassEquipType } from "@/components/admin/settings/equips-table";
import { TraitType } from "@/components/admin/settings/traits-table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { attributeTypes, classTypes, tierTypes } from "@/db/schema";
import { GetDiscordEmoteName } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

type CopyMarkdownProps = ({
	prefix: 'tier',
} & InferSelectModel<typeof tierTypes>) | ({
	prefix: 'class',
} & InferSelectModel<typeof classTypes>) | ({
	prefix: 'attr',
} & InferSelectModel<typeof attributeTypes>) | ({
	prefix: 'trait'
} & TraitType) | ({
	prefix: 'equip'
} & ClassEquipType)

export function CopyMarkdown({
	prefix,
	id,
	name,
	discordEmote,
	image
}: CopyMarkdownProps) {
	
	const label = GetDiscordEmoteName(prefix, name, id)
	const markdown = `<:${label}:${discordEmote}>`
	
	const handleCopy = async () => {
		
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
				<TooltipContent className="flex flex-col items-center justify-center">
					<Image src={image || ''} alt={''} width={25} height={25}/>
					<p>{markdown}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}