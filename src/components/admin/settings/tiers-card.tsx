import { TierDialog } from "@/components/admin/settings/tier-dialog";
import { TiersTable } from "@/components/admin/settings/tiers-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function TiersCard() {
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
				<TiersTable/>
			</CardContent>
		</Card>
	)
}