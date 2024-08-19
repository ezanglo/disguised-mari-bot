"use server"

import { DeleteDiscordEmote, UploadDiscordEmote } from "@/actions/discord";
import { auth } from "@/auth";
import { TierFormSchema } from "@/components/admin/settings/tier-form";
import { ROLES } from "@/constants/discord";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { tierTypes } from "@/db/schema/types";
import { GetDiscordEmoteName } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export const insertTierType = async (payload: TierFormSchema) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(tierTypes).values({
			name: payload.name,
			createdBy: user.id,
		}).returning().then((res) => res[0] ?? null);

		if(payload.image){
			
			const emoteName = GetDiscordEmoteName('class', payload.name, result.id);
			
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image){
				if('errors' in image){
					throw new Error(image.errors[0].message)
				}
				const emoteUrl = `https://cdn.discordapp.com/emojis/${image.id}.webp?size=32&quality=lossless`
				return trx.update(tierTypes).set({
					discordEmote: image.id,
					image: emoteUrl,
					updatedBy: user.id,
				}).where(eq(tierTypes.id, result.id)).returning();
			}
		}

		return result;
	});

	revalidatePath(ROUTES.ADMIN.SETTINGS.TYPES);
	return response;
}

export const updateTierType = async (payload: TierFormSchema) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const tierType = await db.query.tierTypes.findFirst({
		where: eq(tierTypes.id, payload.id || '')
	})
	if(!tierType){
		throw new Error("Class type not found");
	}
	
	const response = await db.transaction(async (trx) => {
		if(payload.image && payload.image.startsWith('data:image/png;base64,')) {
			
			if(tierType.discordEmote){
				await DeleteDiscordEmote(tierType.discordEmote);
			}
			
			const emoteName = GetDiscordEmoteName('class', payload.name, tierType.id);
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image){
				if('errors' in image){
					throw new Error(image.errors[0].message)
				}
				payload.image = `https://cdn.discordapp.com/emojis/${image.id}.webp?size=32&quality=lossless`;
				payload.discordEmote = image.id;
			}
		}
		
		return trx.update(tierTypes).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(tierTypes.id, payload.id || '')).returning();
	});

	revalidatePath(ROUTES.ADMIN.SETTINGS.TYPES);
	return response;
}


export const deleteTierType = async (id: string) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const tierType = await db.query.tierTypes.findFirst({
		where: eq(tierTypes.id, id)
	})
	if(!tierType){
		throw new Error("Class type not found");
	}
	
	if(tierType.discordEmote){
		await DeleteDiscordEmote(tierType.discordEmote);
	}
	
	const response = await db.delete(tierTypes).where(eq(tierTypes.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.SETTINGS.TYPES);
	return response;
}