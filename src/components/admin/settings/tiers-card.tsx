import { TierDialog } from "@/components/admin/settings/tier-dialog";
import { TiersTable } from "@/components/admin/settings/tiers-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { tierTypes } from "@/db/schema";

export async function TiersCard() {
	
	const result = await db.select().from(tierTypes);
	
	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center gap-2">
				<div>
					<CardTitle>Tiers</CardTitle>
					<CardDescription>
						Used to identify hero tiers.
					</CardDescription>
				</div>
				<TierDialog/>
			</CardHeader>
			<CardContent>
				<TiersTable data={result}/>
			</CardContent>
		</Card>
	)
}