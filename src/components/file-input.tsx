import { Input, InputProps } from "@/components/ui/input";
import { useState } from "react";

type FileInputProps = InputProps & {
	onValueChange: (value: string) => void,
}

export function FileInput({
	onValueChange,
}: FileInputProps) {
	
	const [file, setFile] = useState('');
	
	return (
		<Input
			type="file"
			placeholder="upload"
			onChange={event => {
				const file = event.target.files?.[0];
				if (file) {
					const reader = new FileReader();
					reader.onloadend = async () => {
						const base64String = reader.result as string;
						onValueChange(base64String);
					};
					reader.readAsDataURL(file);
				}
			}}
		/>
	)
}