import { auth } from "@/auth";
import { isAuthorized } from "@/lib/utils";

export async function getAuthorizedUser(){

	const session = await auth();
	const user = session?.user;

  return isAuthorized(user) && user;
}