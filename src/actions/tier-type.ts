"use server"

import { DeleteDiscordEmote, UpdateDiscordEmoteName, UploadDiscordEmote } from "@/actions/discord";
import { TierFormSchema } from "@/components/admin/tiers/tier-form";
import { DISCORD_EMOTE_URL } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { tierTypes } from "@/db/schema/types";
import { GetDiscordEmoteName, toCode } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthorizedUser } from "./base";


export const insertTierType = async (payload: TierFormSchema) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(tierTypes).values({
			name: payload.name,
			code: payload.code || toCode(payload.name),
			createdBy: user.id,
		}).returning().then((res) => res[0] ?? null);

		if(payload.image){
			
			const emoteName = GetDiscordEmoteName('tier', payload.name, result.id);
			
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image?.id){
				const emoteUrl = DISCORD_EMOTE_URL(image.id)
				return trx.update(tierTypes).set({
					discordEmote: image.id,
					image: emoteUrl,
					updatedBy: user.id,
				}).where(eq(tierTypes.id, result.id)).returning();
			}
		}

		return result;
	});

	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}

export const updateTierType = async (payload: TierFormSchema) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const tierType = await db.query.tierTypes.findFirst({
		where: eq(tierTypes.id, payload.id || '')
	})
	if(!tierType){
		throw new Error("Tier type not found");
	}
	
	const response = await db.transaction(async (trx) => {
		const emoteName = GetDiscordEmoteName('tier', payload.name, tierType.id);
		
		if(tierType.discordEmote && payload.name !== tierType.name){
			await UpdateDiscordEmoteName(tierType.discordEmote, emoteName);
		}
		
		if(payload.image && payload.image.startsWith('data:image/png;base64,')) {
			
			if(tierType.discordEmote){
				await DeleteDiscordEmote(tierType.discordEmote);
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
		
		return trx.update(tierTypes).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(tierTypes.id, payload.id || '')).returning();
	});

	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}


export const deleteTierType = async (id: string) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const tierType = await db.query.tierTypes.findFirst({
		where: eq(tierTypes.id, id)
	})
	if(!tierType){
		throw new Error("Tier type not found");
	}
	
	if(tierType.discordEmote){
		await DeleteDiscordEmote(tierType.discordEmote);
	}
	
	const response = await db.delete(tierTypes).where(eq(tierTypes.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}