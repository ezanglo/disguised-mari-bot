"use server";

import { signIn, signOut } from "@/auth";

export async function login(){
	return await signIn('discord');
}

export async function logout() {
	return await signOut({
		redirectTo: '/'
	});
}