"use server"

import { DeleteDiscordEmote, UpdateDiscordEmoteName, UploadDiscordEmote } from "@/actions/discord";
import { SkillFormSchema } from "@/components/admin/skills/skill-form";
import { DISCORD_EMOTE_URL } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { GetDiscordEmoteName } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthorizedUser } from "./base";

export const insertSkill = async (payload: SkillFormSchema, skipUpload: boolean = false) => {
	const user = await getAuthorizedUser();
	if (!user) {
		throw new Error("Unauthorized");
	}
	
	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(skills).values({
			...payload,
			createdBy: user.id,
		}).returning().then((res) => res[0] ?? null);
		
		if (payload.image && !payload.discordEmote) {
			
			const emoteName = GetDiscordEmoteName('skill', payload.code, result.id);
			
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if (image?.id) {
				const emoteUrl = DISCORD_EMOTE_URL(image.id)
				return trx.update(skills).set({
					discordEmote: image.id,
					image: emoteUrl,
					updatedBy: user.id,
				}).where(eq(skills.id, result.id)).returning();
			}
		}
		
		return result;
	});
	
	revalidatePath(ROUTES.ADMIN.TRAITS.BASE);
	return response;
}

export const updateSkill = async (payload: SkillFormSchema) => {
	const user = await getAuthorizedUser();
	if (!user) {
		throw new Error("Unauthorized");
	}
	
	const skill = await db.query.skills.findFirst({
		where: eq(skills.id, payload.id || '')
	})
	if (!skill) {
		throw new Error("Skill not found");
	}
	
	const response = await db.transaction(async (trx) => {
		
		const emoteName = GetDiscordEmoteName('skill', payload.upgradeType + payload.code, skill.id);
		
		if (skill.discordEmote &&
			(payload.upgradeType !== skill.upgradeType || payload.code !== skill.code)
		) {
			await UpdateDiscordEmoteName(skill.discordEmote, emoteName);
		}
		
		if (payload.image && payload.image.startsWith('data:image/png;base64,')) {
			
			if (skill.discordEmote) {
				await DeleteDiscordEmote(skill.discordEmote);
			}
			
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if (image?.id) {
				payload.image = DISCORD_EMOTE_URL(image.id)
				payload.discordEmote = image.id;
			}
		}
		
		return trx.update(skills).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(skills.id, payload.id || '')).returning();
	});
	
	revalidatePath(ROUTES.ADMIN.TRAITS.BASE);
	return response;
}


export const deleteSkill = async (id: string) => {
	const user = await getAuthorizedUser();
	if (!user) {
		throw new Error("Unauthorized");
	}
	
	const skill = await db.query.skills.findFirst({
		where: eq(skills.id, id)
	})
	if (!skill) {
		throw new Error("Skill not found");
	}
	
	if (skill.discordEmote) {
		await DeleteDiscordEmote(skill.discordEmote);
	}
	
	const response = await db.delete(skills).where(eq(skills.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.TRAITS.BASE);
	return response;
}