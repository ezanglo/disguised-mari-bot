import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResourcesPage() {
	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center gap-2">
				<div>
					<CardTitle>Resources</CardTitle>
					<CardDescription>
						List of resources.
					</CardDescription>
				</div>
				{/*<TraitDialog upgradeTypes={upgradeTypes}/>*/}
			</CardHeader>
			<CardContent>
				{/*<UpgradeTypesSelector data={upgradeTypes}/>*/}
				{/*<TraitsTable data={items} upgradeTypes={upgradeTypes}/>*/}
			</CardContent>
		</Card>
	)
}