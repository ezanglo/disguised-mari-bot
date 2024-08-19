"use server"

import { getDiscordApiErrors } from "@/lib/utils";
import { RESTError, RESTPostAPIApplicationEmojiResult } from "discord-api-types/v10";

export const UploadDiscordEmote = async (payload: {prefix?: string, name: string, image: string}) => {
	try {
		const url = [process.env.DISCORD_API_URL, 'applications', process.env.DISCORD_BOT_APPLICATION_ID,'emojis'].join('/')
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				"Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload)
		})
		
		if(!response.ok){
			const data = await response.json() as RESTError
			return getDiscordApiErrors(data);
		}
		
		return await response.json() as RESTPostAPIApplicationEmojiResult;
	}
	catch (error) {
		console.log(error)
		return null;
	}
}


export const DeleteDiscordEmote = async (id: string) => {
	try {
		const url = [process.env.DISCORD_API_URL, 'applications', process.env.DISCORD_BOT_APPLICATION_ID,'emojis', id].join('/')
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				"Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}`,
				'Content-Type': 'application/json',
			},
		})
		
		if(!response.ok){
			return null;
		}
		
		return true
	}
	catch (error) {
		console.log(error)
		return null;
	}
}