import { AttributeDialog } from "@/components/admin/settings/attribute-dialog";
import { AttributesTable } from "@/components/admin/settings/attributes-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function AttributesCard() {
	
	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center gap-2">
				<div>
					<CardTitle>Attributes</CardTitle>
					<CardDescription>
						Used to identify hero attributes.
					</CardDescription>
				</div>
				<AttributeDialog/>
			</CardHeader>
			<CardContent>
				<AttributesTable/>
			</CardContent>
		</Card>
	)
}