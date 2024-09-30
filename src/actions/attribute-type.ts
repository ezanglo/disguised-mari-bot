"use server"

import { DeleteDiscordEmote, UpdateDiscordEmoteName, UploadDiscordEmote } from "@/actions/discord";
import { AttributeFormSchema } from "@/components/admin/settings/attribute-form";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { attributeTypes } from "@/db/schema/types";
import { GetDiscordEmoteName, toCode } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthorizedUser } from "./base";


export const insertAttributeType = async (payload: AttributeFormSchema) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(attributeTypes).values({
			name: payload.name,
			code: payload.code || toCode(payload.name),
			createdBy: user.id,
		}).returning().then((res) => res[0] ?? null);

		if(payload.image){
			
			const emoteName = GetDiscordEmoteName('attr', payload.name, result.id);
			
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image){
				const emoteUrl = `https://cdn.discordapp.com/emojis/${image.id}.webp`
				return trx.update(attributeTypes).set({
					discordEmote: image.id,
					image: emoteUrl,
					updatedBy: user.id,
				}).where(eq(attributeTypes.id, result.id)).returning();
			}
		}

		return result;
	});

	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}

export const updateAttributeType = async (payload: AttributeFormSchema) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const attributeType = await db.query.attributeTypes.findFirst({
		where: eq(attributeTypes.id, payload.id || '')
	})
	if(!attributeType){
		throw new Error("Attribute type not found");
	}
	
	const response = await db.transaction(async (trx) => {
		
		const emoteName = GetDiscordEmoteName('attr', payload.name, attributeType.id);
		
		if(attributeType.discordEmote && payload.name !== attributeType.name){
			await UpdateDiscordEmoteName(attributeType.discordEmote, emoteName);
		}
		
		if((payload.image && payload.image.startsWith('data:image/png;base64,'))) {
			
			if(attributeType.discordEmote){
				await DeleteDiscordEmote(attributeType.discordEmote);
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
		
		return trx.update(attributeTypes).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(attributeTypes.id, payload.id || '')).returning();
	});

	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}


export const deleteAttributeType = async (id: string) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const attributeType = await db.query.attributeTypes.findFirst({
		where: eq(attributeTypes.id, id)
	})
	if(!attributeType){
		throw new Error("Attribute type not found");
	}
	
	if(attributeType.discordEmote){
		await DeleteDiscordEmote(attributeType.discordEmote);
	}
	
	const response = await db.delete(attributeTypes).where(eq(attributeTypes.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}