"use client";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
	return (
		<div>
			DashboardPage
			<Button onClick={() => logout()}>Sign out</Button>
		</div>
	)
}