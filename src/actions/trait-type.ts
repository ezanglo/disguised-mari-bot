"use server"

import { DeleteDiscordEmote, UploadDiscordEmote } from "@/actions/discord";
import { auth } from "@/auth";
import { TraitTypeFormSchema } from "@/components/admin/settings/trait-form";
import { ROLES } from "@/constants/discord";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { traitTypes } from "@/db/schema/types";
import { GetDiscordEmoteName } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const insertTraitType = async (payload: TraitTypeFormSchema) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(traitTypes).values({
			name: payload.name,
			code: payload.code,
			upgradeType: payload.upgradeType,
			createdBy: user.id,
		}).returning().then((res) => res[0] ?? null);

		if(payload.image){
			
			const emoteName = GetDiscordEmoteName('trait', payload.upgradeType + payload.code, result.id);
			
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image){
				const emoteUrl = `https://cdn.discordapp.com/emojis/${image.id}.webp?size=32&quality=lossless`
				return trx.update(traitTypes).set({
					discordEmote: image.id,
					image: emoteUrl,
					updatedBy: user.id,
				}).where(eq(traitTypes.id, result.id)).returning();
			}
		}

		return result;
	});

	revalidatePath(ROUTES.ADMIN.SETTINGS.TRAITS);
	return response;
}

export const updateTraitType = async (payload: TraitTypeFormSchema) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const traitType = await db.query.traitTypes.findFirst({
		where: eq(traitTypes.id, payload.id || '')
	})
	if(!traitType){
		throw new Error("Class type not found");
	}
	
	const response = await db.transaction(async (trx) => {
		if(payload.image && payload.image.startsWith('data:image/png;base64,')) {
			
			if(traitType.discordEmote){
				await DeleteDiscordEmote(traitType.discordEmote);
			}
			
			const emoteName = GetDiscordEmoteName('trait', payload.upgradeType + payload.code, traitType.id);
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image){
				payload.image = `https://cdn.discordapp.com/emojis/${image.id}.webp?size=32&quality=lossless`;
				payload.discordEmote = image.id;
			}
		}
		
		return trx.update(traitTypes).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(traitTypes.id, payload.id || '')).returning();
	});

	revalidatePath(ROUTES.ADMIN.SETTINGS.TRAITS);
	return response;
}


export const deleteTraitType = async (id: string) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const traitType = await db.query.traitTypes.findFirst({
		where: eq(traitTypes.id, id)
	})
	if(!traitType){
		throw new Error("Class type not found");
	}
	
	if(traitType.discordEmote){
		await DeleteDiscordEmote(traitType.discordEmote);
	}
	
	const response = await db.delete(traitTypes).where(eq(traitTypes.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.SETTINGS.TRAITS);
	return response;
}