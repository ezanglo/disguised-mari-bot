"use client";

import { LoadingSpinner } from "@/components/loading-spinner";
import { Button, ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import { useState } from "react";

type UploadButtonProps = ButtonProps & {
	value?: string,
	onUpload: (url: string[]) => void,
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
				onUpload(res.map((r) => {
					return `https://utfs.io/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/${r.key}`
				}))
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
		<>
			<Input
				id="upload-button"
				className="hidden"
				placeholder="Picture"
				type="file"
				accept={fileTypes.join(", ")}
				onChange={async (event) => {
					setLoading(true);
					const files = event.target.files;
					if (files && files.length > 0) {
						await startUpload(Array.from(files));
					}
				}}
			/>
			<Button  {...props} asChild disabled={loading}>
				<Label htmlFor="upload-button" className="cursor-pointer flex items-center justify-center">
					{loading ? (
						<LoadingSpinner className="size-4"/>
					) : value ? (
						<Image src={value} alt={''} width={25} height={25}/>
					) : 'Upload'}
				</Label>
			</Button>
		</>
	)
}