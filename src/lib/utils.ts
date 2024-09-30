import { ROLES } from "@/constants/discord";
import * as cheerio from "cheerio";
import { type ClassValue, clsx } from "clsx"
import { RESTError, RESTErrorFieldInformation, RESTErrorGroupWrapper } from "discord-api-types/v10";
import { Session } from "next-auth";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function isAuthorized(user?: Session['user']){
  return user?.roles.some(role => 
		[ROLES.ADMIN, ROLES.MODERATOR].includes(role)
	);
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
	return [prefix.toLowerCase(), toCode(name), id.split('-')[0]].join('_')
}

export function GetDiscordEmoteMarkdown(discordId: string, prefix: string, name: string, id: string){
	const label = GetDiscordEmoteName(prefix, name, id)
	return `<:${label}:${discordId}>`
}

export function toCode(text: string = ""){
	return text.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase()
}

export function toCamelCase(text: string = ""){
	// First, remove symbols and replace with spaces
	const cleanText = text.replace(/[^\w\s]/g, '');
	
	// Then convert to camel case
	return cleanText.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
		index === 0 ? word.toLowerCase() : word.toUpperCase()
	).replace(/\s+/g, '');
}

export function parseHtmlImage(html: string): { imageName: string, imageSrc: string } {
  const $ = cheerio.load(html);
  const img = $('img');
  return {
    imageName: img.attr('data-image-name') || '',
    imageSrc: img.attr('data-src') || img.attr('src') || '',
  };
}

export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function stripHtml(html: string): string {
  const $ = cheerio.load(html);
  return $.text();
}