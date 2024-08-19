'use client';

import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Paintbrush } from "lucide-react";
import { forwardRef, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
	value: string;
	onChange?: (value: string) => void;
	onBlur?: () => void;
}

const ColorPicker = forwardRef<
	HTMLInputElement,
	Omit<ButtonProps, 'value' | 'onChange' | 'onBlur'> & ColorPickerProps
>(
	(
		{disabled, value, onChange, onBlur, name, className, ...props},
		ref
	) => {
		const [open, setOpen] = useState(false);
		
		const parsedValue = useMemo(() => {
			return value;
		}, [value]);
		
		return (
			<Popover onOpenChange={setOpen} open={open}>
				<PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
					<Button
						variant={'outline'}
						className={cn(
							'justify-start text-left font-normal',
							!parsedValue && 'text-muted-foreground',
							className
						)}
					>
						<div className="w-full flex items-center gap-2">
							{value ? (
								<div
									className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
									style={{ background: parsedValue}}
								></div>
							) : (
								<Paintbrush className="h-4 w-4" />
							)}
							<div className="truncate flex-1">
								{parsedValue ? parsedValue : 'Pick a color'}
							</div>
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-full flex flex-col gap-2 p-5'>
					<HexColorPicker
						color={parsedValue || '#FFFFFF'}
						onChange={onChange}
						style={{width: '100%'}}
					/>
					<Input
						maxLength={7}
						onChange={(e) => {
							onChange?.(e?.currentTarget?.value);
						}}
						ref={ref}
						value={parsedValue}
					/>
				</PopoverContent>
			</Popover>
		);
	}
);
ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };