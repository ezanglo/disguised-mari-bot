import { type ClassValue, clsx } from "clsx"
import { RESTError, RESTErrorFieldInformation, RESTErrorGroupWrapper } from "discord-api-types/v10";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function enumToPgEnum<T extends Record<string, any>>(
	myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
	return Object.values(myEnum).map((value: any) => `${value}`) as any
}

export function getDiscordApiErrors(error: RESTError) {
	const data = error.errors as { name: RESTErrorGroupWrapper }
	
	return {
		errors: data.name._errors as RESTErrorFieldInformation[]
	}
}

export function GetDiscordEmoteName(prefix: string, name: string, id: string){
	name = name.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_');
	return [prefix, name.toLowerCase(), id.split('-')[0]].join('_')
}

export function GetDiscordEmoteMarkdown(discordId: string, prefix: string, name: string, id: string){
	const label = GetDiscordEmoteName(prefix, name, id)
	return `<:${label}:${discordId}>`
}