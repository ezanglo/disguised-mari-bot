"use client";

import { UploadDiscordEmote } from "@/actions/discord";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button, ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type DiscordEmoteUploadProps = ButtonProps & {
	value?: string,
	onUpload?: (url: string) => void,
}

export function DiscordEmoteUpload({
	value,
	onUpload,
	onError,
	...props
}: DiscordEmoteUploadProps) {
	
	const [loading, setLoading] = useState(false);
	
	const handleUploader = async (name: string, image: string) => {
		const response = await UploadDiscordEmote({
			name,
			image,
		});
		
		if(response){
			if('errors' in response){
				response.errors.forEach((error) => {
					toast.error(error.message)
				})
			}
			else {
				toast.error('Emoji has been uploaded')
				const emoteUrl = `https://cdn.discordapp.com/emojis/${response.id}.webp?size=32&quality=lossless`
				onUpload?.(emoteUrl)
			}
		}
		setLoading(false);
	}
	
	return (
		<>
			<Input
				id="upload-button"
				className="hidden"
				placeholder="emote"
				type="file"
				accept={'image/png, image/jpeg, image/gif'}
				onChange={(event) => {
					setLoading(true);
					const file = event.target.files?.[0];
					if (file) {
						const reader = new FileReader();
						reader.onloadend = async () => {
							const base64String = reader.result as string;
							await handleUploader(file.name.split('.')[0], base64String);
						};
						reader.readAsDataURL(file);
					}
				}}
			/>
			<Button  {...props} asChild disabled={loading}>
				<Label htmlFor="upload-button" className="cursor-pointer flex items-center justify-center">
					{loading ? (
						<LoadingSpinner className="size-4"/>
					) : value ? (
						<Image src={value} alt={''} width={25} height={25}/>
					): 'Upload'}
				</Label>
			</Button>
		</>
	)
}