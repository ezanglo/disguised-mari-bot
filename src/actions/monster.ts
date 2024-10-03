"use server"

import { DeleteDiscordEmote, UpdateDiscordEmoteName, UploadDiscordEmote } from "@/actions/discord";
import { MonsterFormSchema } from "@/components/admin/monsters/monster-form";
import { DISCORD_EMOTE_URL } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { monsters } from "@/db/schema";
import { GetDiscordEmoteName } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthorizedUser } from "./base";


export const insertMonster = async (payload: MonsterFormSchema) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(monsters).values({
			...payload,
			createdBy: user.id,
		}).returning().then((res) => res[0] ?? null);

		if(payload.image){
			let imageBase64 = payload.image;
			const isUrl = payload.image.startsWith('http');
			if (isUrl) {
				try {
					const response = await fetch(payload.image);
					const arrayBuffer = await response.arrayBuffer();
					const base64 = Buffer.from(arrayBuffer).toString('base64');
					imageBase64 = `data:image/png;base64,${base64}`;
				} catch (error) {
					console.error('Error converting image to base64:', error);
					throw new Error('Failed to convert image to base64');
				}
			}
			
			const emoteName = GetDiscordEmoteName('mob', payload.name, result.id);
			
			const discordEmote = await UploadDiscordEmote({
				name: emoteName,
				image: imageBase64,
			})
			if(discordEmote?.id){
				const emoteUrl = isUrl ? payload.image : DISCORD_EMOTE_URL(discordEmote.id)
				return trx.update(monsters).set({
					discordEmote: discordEmote.id,
					image: emoteUrl,
					updatedBy: user.id,
				}).where(eq(monsters.id, result.id)).returning();
			}
		}

		return result;
	});

	revalidatePath(ROUTES.ADMIN.HEROES.BASE);
	return response;
}

export const updateMonster = async (payload: MonsterFormSchema) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const monster = await db.query.monsters.findFirst({
		where: eq(monsters.id, payload.id || '')
	})
	if(!monster){
		throw new Error("Monster not found");
	}
	
	const response = await db.transaction(async (trx) => {
		const emoteName = GetDiscordEmoteName('mob', payload.name, monster.id);
		
		if(monster.discordEmote && payload.name !== monster.name){
			await UpdateDiscordEmoteName(monster.discordEmote, emoteName);
		}
		
		if(payload.image && payload.image.startsWith('data:image/png;base64,')) {
			
			if(monster.discordEmote){
				await DeleteDiscordEmote(monster.discordEmote);
			}
			
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image?.id){
				payload.image = DISCORD_EMOTE_URL(image.id)
				payload.discordEmote = image.id;
			}
		}
		
		return trx.update(monsters).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(monsters.id, payload.id || '')).returning();
	});

	revalidatePath(ROUTES.ADMIN.HEROES.BASE);
	return response;
}


export const deleteMonster = async (id: string) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const monster = await db.query.monsters.findFirst({
		where: eq(monsters.id, id)
	})
	if(!monster){
		throw new Error("Monster not found");
	}
	
	if(monster.discordEmote){
		await DeleteDiscordEmote(monster.discordEmote);
	}
	
	const response = await db.delete(monsters).where(eq(monsters.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.HEROES.BASE);
	return response;
}