"use server";

import { DeleteDiscordEmote, UploadDiscordEmote } from "@/actions/discord";
import { ListItemFormSchema } from "@/components/admin/settings/list-item-form";
import { DISCORD_EMOTE_URL } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { listItems, lists } from "@/db/schema";
import { GetDiscordEmoteName, toCode } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthorizedUser } from "./base";

export const insertListGroup = async (name: string) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const response = await db.insert(lists).values({
		name: name,
		createdBy: user.id,
	}).returning().then((res) => res[0] ?? null);
	
	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}

export const updateListGroup = async (id: string, name: string) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const response = await db.update(lists).set({
		name,
		updatedBy: user.id,
	}).where(eq(lists.id, id)).returning();
	
	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}

export const deleteListGroup = async (id: string) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const response = await db.delete(lists).where(eq(lists.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}

export const insertListItem = async (payload: ListItemFormSchema) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const listGroup = await db.query.lists.findFirst({
		where: eq(lists.id, payload.listId)
	})
	if (!listGroup) {
		throw new Error("List group not found");
	}
	
	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(listItems).values({
			name: payload.name,
			listId: payload.listId,
			code: payload.code,
			createdBy: user.id,
		}).returning().then((res) => res[0] ?? null);
		
		if (payload.image) {
			const emoteName = GetDiscordEmoteName(toCode(listGroup.name), payload.name, result.id);
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image?.id){
				const emoteUrl = DISCORD_EMOTE_URL(image.id)
				return trx.update(listItems).set({
					discordEmote: image.id,
					image: emoteUrl,
					updatedBy: user.id,
				}).where(eq(listItems.id, result.id)).returning();
			}
		}
		
		return result;
	});
	
	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}

export const updateListItem = async (payload: ListItemFormSchema) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const listItem = await db.query.listItems.findFirst({
		where: eq(listItems.id, payload.id || '')
	})
	if (!listItem) {
		throw new Error("List Item not found");
	}
	
	const listGroup = await db.query.lists.findFirst({
		where: eq(lists.id, payload.listId)
	})
	if (!listGroup) {
		throw new Error("List group not found");
	}
	
	const response = await db.transaction(async (trx) => {
		if (payload.image && payload.image.startsWith('data:image/png;base64,')) {
			
			if (listItem.discordEmote) {
				await DeleteDiscordEmote(listItem.discordEmote);
			}
			
			const emoteName = GetDiscordEmoteName(listGroup.name, payload.name, listItem.id);
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image?.id){
				payload.image = DISCORD_EMOTE_URL(image.id)
				payload.discordEmote = image.id;
			}
		}
		
		return trx.update(listItems).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(listItems.id, payload.id || '')).returning();
	});
	
	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}

export const deleteListItem = async (id: string) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const listItem = await db.query.listItems.findFirst({
		where: eq(listItems.id, id)
	})
	if (!listItem) {
		throw new Error("List item not found");
	}
	
	if (listItem.discordEmote) {
		await DeleteDiscordEmote(listItem.discordEmote);
	}
	
	const response = await db.delete(listItems).where(eq(listItems.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}