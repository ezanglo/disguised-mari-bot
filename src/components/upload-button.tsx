"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadThing } from "@/lib/uploadthing";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

type UploadButtonProps = ButtonProps & {
	value?: string,
	onUpload: (url: string) => void,
}

export function UploadButton({
	value,
	onUpload,
	...props
}: UploadButtonProps) {
	
	const [loading, setLoading] = useState(false);
	
	const {startUpload, permittedFileInfo} = useUploadThing(
		"imageUploader",
		{
			onClientUploadComplete: (res) => {
				const formatted = res.map((r) => {
					return `https://utfs.io/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/${r.key}`
				});
				onUpload(formatted[0])
				setLoading(false);
			},
			onUploadError: () => {
				setLoading(false);
			},
			onUploadBegin: () => {
				setLoading(true);
			},
		},
	);
	
	const fileTypes = permittedFileInfo?.config
		? Object.keys(permittedFileInfo?.config)
		: [];
	
	return (
		<div className="relative">
			<Input
				type="file"
				placeholder="upload"
				accept={fileTypes.join(", ")}
				disabled={loading}
				onChange={async (event) => {
					setLoading(true);
					const files = event.target.files;
					if (files && files.length > 0) {
						await startUpload(Array.from(files));
					}
				}}
			/>
			{loading && <div className="absolute top-0 right-0 h-full flex items-center justify-center p-3">
				<Loader2Icon className="animate-spin size-4" />
			</div>}
		</div>
	)
}