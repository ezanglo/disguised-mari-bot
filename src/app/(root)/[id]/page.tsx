import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

type UserPageProps = {
	params: {
		id: string
	}
}

export default async function UserPage({
	params
}: UserPageProps) {
	
	const session = await auth();
	const user = session?.user;
	
	return (
		<div className="flex flex-col gap-5 max-w-5xl mx-auto">
			<h1 className="text-3xl">Welcome, {user?.nick || `@${user?.name}`}!</h1>
			<Separator/>
			<h2 className="text-xl">Your lineups</h2>
			<div>
				<Button variant="outline" className="h-52 w-60 border-dashed opacity-70 hover:opacity-100">
					<Link href={ROUTES.LINEUPS.CREATE}>
						<PlusIcon className="size-5"/>
						<span>Add</span>
					</Link>
				</Button>
			</div>
			<div>
				<h2 className="text-xl">Your Equip Presets</h2>
			</div>
			<div>
				<Button variant="outline" className="h-52 w-60 border-dashed opacity-70 hover:opacity-100">
					<Link href={ROUTES.LINEUPS.CREATE}>
						<PlusIcon className="size-5"/>
						<span>Add</span>
					</Link>
				</Button>
			</div>
		</div>
	)
}