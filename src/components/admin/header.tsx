import { auth } from "@/auth";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { UserMenu } from "@/components/user-menu";
import * as React from "react";

export async function Header() {
	
	const session = await auth();
	const user = session?.user;
	
	return (
		<header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6 bg-muted/40">
			<MobileSidebar/>
			<div className="flex-1">
				<PageBreadcrumbs/>
			</div>
			{user && <UserMenu user={user}/>}
		</header>
	)
}