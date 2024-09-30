"use server"

import { DeleteDiscordEmote, UpdateDiscordEmoteName, UploadDiscordEmote } from "@/actions/discord";
import { HeroFormSchema } from "@/components/admin/heroes/hero-form";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { heroes } from "@/db/schema";
import { GetDiscordEmoteName, toCode } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthorizedUser } from "./base";


export const insertHero = async (payload: HeroFormSchema) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(heroes).values({
			...payload,
			code: toCode(payload.name),
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
			
			const emoteName = GetDiscordEmoteName('hero', payload.name, result.id);
			
			const discordEmote = await UploadDiscordEmote({
				name: emoteName,
				image: imageBase64,
			})
			if(discordEmote){
				const emoteUrl = isUrl ? payload.image : `https://cdn.discordapp.com/emojis/${discordEmote.id}.webp`
				return trx.update(heroes).set({
					discordEmote: discordEmote.id,
					image: emoteUrl,
					updatedBy: user.id,
				}).where(eq(heroes.id, result.id)).returning();
			}
		}

		return result;
	});

	revalidatePath(ROUTES.ADMIN.HEROES.BASE);
	return response;
}

export const updateHero = async (payload: HeroFormSchema) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const hero = await db.query.heroes.findFirst({
		where: eq(heroes.id, payload.id || '')
	})
	if(!hero){
		throw new Error("List item not found");
	}
	
	const response = await db.transaction(async (trx) => {
		const emoteName = GetDiscordEmoteName('hero', payload.name, hero.id);
		
		if(hero.discordEmote && payload.name !== hero.name){
			await UpdateDiscordEmoteName(hero.discordEmote, emoteName);
		}
		
		if(payload.image && payload.image.startsWith('data:image/png;base64,')) {
			
			if(hero.discordEmote){
				await DeleteDiscordEmote(hero.discordEmote);
			}
			
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image){
				payload.image = `https://cdn.discordapp.com/emojis/${image.id}.webp`;
				payload.discordEmote = image.id;
			}
		}
		
		return trx.update(heroes).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(heroes.id, payload.id || '')).returning();
	});

	revalidatePath(ROUTES.ADMIN.HEROES.BASE);
	return response;
}


export const deleteHero = async (id: string) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const hero = await db.query.heroes.findFirst({
		where: eq(heroes.id, id)
	})
	if(!hero){
		throw new Error("List item not found");
	}
	
	if(hero.discordEmote){
		await DeleteDiscordEmote(hero.discordEmote);
	}
	
	const response = await db.delete(heroes).where(eq(heroes.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.HEROES.BASE);
	return response;
}