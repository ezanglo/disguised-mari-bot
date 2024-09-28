import { auth } from "@/auth";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";
import { Input } from "@/components/ui/input";
import { UserMenu } from "@/components/user-menu";
import { Search } from "lucide-react";
import * as React from "react";

export async function Header() {

	const session = await auth();
	const user = session?.user;

	return (
		<header className="fixed top-0 right-0 left-0 md:left-[220px] lg:left-[280px] h-14 lg:h-[60px] border-b bg-background z-10">
			<div className="flex items-center gap-4 bg-muted/40 size-full  px-4 lg:px-6">
				<MobileSidebar />
				<div className="w-full flex-1">
					<form>
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search products..."
								className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
							/>
						</div>
					</form>
				</div>
				{user && <UserMenu user={user} iconOnly />}
			</div>
		</header>
	)
}