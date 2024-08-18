import { auth } from "@/auth";
import { HeaderWrapper } from "@/components/header-wrapper";
import { LoginButton } from "@/components/login-button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { CrownIcon } from "lucide-react";

export async function Header() {
	
	const session = await auth();
	const user = session?.user;
	
	return (
		<HeaderWrapper>
			<div className="flex flex-row items-center gap-5 w-full">
				<Avatar className="border-2 border-primary">
					<AvatarImage src="/images/mari-icon.png" alt="mari" width={128} height={128}/>
				</Avatar>
				<span className="font-bold">Disguised Mari</span>
			</div>
			{user ? (
				<UserMenu user={user}/>
			):(
				<div className="hidden sm:flex flex-row items-center gap-2 w-full justify-end">
					<Button variant="secondary" className="rounded-full text-amber-500 border border-amber-500">
						<CrownIcon className="size-4 mr-2"/>
						Support Us
					</Button>
					<LoginButton/>
				</div>
			)}
		</HeaderWrapper>
	)
}