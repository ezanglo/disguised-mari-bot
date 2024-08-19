"use server"

import { getDiscordApiErrors } from "@/lib/utils";
import { RESTError, RESTPostAPIApplicationEmojiResult } from "discord-api-types/v10";

export const UploadDiscordEmote = async (payload: {prefix?: string, name: string, image: string}) => {
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
		const errors = getDiscordApiErrors(data);
		if('errors' in errors){
			throw new Error(errors.errors[0].message)
		}
	}
	
	return await response.json() as RESTPostAPIApplicationEmojiResult;
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