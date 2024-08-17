"use server";

import { signIn, signOut } from "@/auth";
import type { BuiltInProviderType } from "@auth/core/providers";

export async function login(provider: BuiltInProviderType){
	return await signIn(provider, {
		redirectTo: '/dashboard'
	});
}

export async function logout() {
	return await signOut({
		redirectTo: '/login'
	});
}