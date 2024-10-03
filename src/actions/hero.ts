"use server"

import { DeleteDiscordEmote, UpdateDiscordEmoteName, UploadDiscordEmote } from "@/actions/discord";
import { HeroFormSchema } from "@/components/admin/heroes/hero-form";
import { DISCORD_EMOTE_URL } from "@/constants/constants";
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

		

		return result;
	});

	revalidatePath(ROUTES.ADMIN.HEROES.BASE);
	revalidatePath(ROUTES.ADMIN.HEROES.ADD);
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
		throw new Error("Hero not found");
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
			if(image?.id){
				payload.image = DISCORD_EMOTE_URL(image.id)
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
		throw new Error("Hero not found");
	}
	
	if(hero.discordEmote){
		await DeleteDiscordEmote(hero.discordEmote);
	}
	
	const response = await db.delete(heroes).where(eq(heroes.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.HEROES.BASE);
	return response;
}