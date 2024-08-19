import { ClassDialog } from "@/components/admin/settings/class-dialog";
import { ClassesTable } from "@/components/admin/settings/classes-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { classTypes } from "@/db/schema/types";

export async function ClassesCard() {
	
	const result = await db.select().from(classTypes);
	
	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center gap-2">
				<div>
					<CardTitle>Classes</CardTitle>
					<CardDescription>
						Used to identify classes of Heroes, Pets and more.
					</CardDescription>
				</div>
				<ClassDialog/>
			</CardHeader>
			<CardContent>
				<ClassesTable data={result}/>
			</CardContent>
		</Card>
	)
}