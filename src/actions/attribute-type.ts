"use server"

import { DeleteDiscordEmote, UploadDiscordEmote } from "@/actions/discord";
import { auth } from "@/auth";
import { AttributeFormSchema } from "@/components/admin/settings/attribute-form";
import { ROLES } from "@/constants/discord";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { attributeTypes } from "@/db/schema/types";
import { GetDiscordEmoteName } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export const insertAttributeType = async (payload: AttributeFormSchema) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(attributeTypes).values({
			name: payload.name,
			createdBy: user.id,
		}).returning().then((res) => res[0] ?? null);

		if(payload.image){
			
			const emoteName = GetDiscordEmoteName('attr', payload.name, result.id);
			
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image){
				if('errors' in image){
					throw new Error(image.errors[0].message)
				}
				const emoteUrl = `https://cdn.discordapp.com/emojis/${image.id}.webp?size=32&quality=lossless`
				return trx.update(attributeTypes).set({
					discordEmote: image.id,
					image: emoteUrl,
					updatedBy: user.id,
				}).where(eq(attributeTypes.id, result.id)).returning();
			}
		}

		return result;
	});

	revalidatePath(ROUTES.ADMIN.SETTINGS.TYPES);
	return response;
}

export const updateAttributeType = async (payload: AttributeFormSchema) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const attributeType = await db.query.attributeTypes.findFirst({
		where: eq(attributeTypes.id, payload.id || '')
	})
	if(!attributeType){
		throw new Error("Class type not found");
	}
	
	const response = await db.transaction(async (trx) => {
		if(payload.image && payload.image.startsWith('data:image/png;base64,')) {
			
			if(attributeType.discordEmote){
				await DeleteDiscordEmote(attributeType.discordEmote);
			}
			
			const emoteName = GetDiscordEmoteName('attr', payload.name, attributeType.id);
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
		
		return trx.update(attributeTypes).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(attributeTypes.id, payload.id || '')).returning();
	});

	revalidatePath(ROUTES.ADMIN.SETTINGS.TYPES);
	return response;
}


export const deleteAttributeType = async (id: string) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const attributeType = await db.query.attributeTypes.findFirst({
		where: eq(attributeTypes.id, id)
	})
	if(!attributeType){
		throw new Error("Class type not found");
	}
	
	if(attributeType.discordEmote){
		await DeleteDiscordEmote(attributeType.discordEmote);
	}
	
	const response = await db.delete(attributeTypes).where(eq(attributeTypes.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.SETTINGS.TYPES);
	return response;
}