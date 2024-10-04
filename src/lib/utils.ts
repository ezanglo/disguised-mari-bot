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
	const data = error.errors as {
		name?: RESTErrorGroupWrapper,
		image?: RESTErrorGroupWrapper
	}
	
	const errors = [];
	if(data.name) {
		errors.push(...data.name._errors as RESTErrorFieldInformation[])
	}
	if (data.image) {
		errors.push(...data.image._errors as RESTErrorFieldInformation[])
	}
	return {errors};
}

export function GetDiscordEmoteName(prefix: string, name: string, id: string){
	return [prefix.toLowerCase(), toCode(name), id.split('-')[0]].join('_').slice(0, 32)
}

export function GetDiscordEmoteMarkdown(discordId: string, prefix: string, name: string, id: string){
	const label = GetDiscordEmoteName(prefix, name, id)
	return `<:${label}:${discordId}>`
}

export function toCode(text: string = "", lower: boolean = true){
	const code = text.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_');
	if(lower){
		return code.toLowerCase()
	}
	return code;
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

export async function fetchImageBase64(imageUrl?: string){

	
	if(!imageUrl || !imageUrl.startsWith('http')){
		return imageUrl;
	}

	if(imageUrl?.startsWith('https://cdn.discordapp.com/emojis')){
		return;
	}

	try {
			const response = await fetch(imageUrl);
			const arrayBuffer = await response.arrayBuffer();
			const base64 = Buffer.from(arrayBuffer).toString('base64');
			const contentType = response.headers.get('content-type') || 'image/png';
			return `data:${contentType};base64,${base64}`;
	} catch (error) {
			console.error('Error converting image to base64:', error);
			throw new Error('Failed to convert image to base64');
	}
}

// Add this helper function at the end of the file
export function hexToRgb(hex: string) {
	// Remove the hash at the start if it's there
	hex = hex.replace(/^#/, '');

	// Parse the hex values
	const bigint = parseInt(hex, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return `${r}, ${g}, ${b}`;
}