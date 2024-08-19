import { AttributesCard } from "@/components/admin/settings/attributes-card";
import { ClassesCard } from "@/components/admin/settings/classes-card";
import { TiersCard } from "@/components/admin/settings/tiers-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
	return (
		<div className="grid gap-6">
			<Tabs defaultValue="tier">
				<TabsList>
					<TabsTrigger value="tier">Tier</TabsTrigger>
					<TabsTrigger value="class">Class</TabsTrigger>
					<TabsTrigger value="attr">Attribute</TabsTrigger>
				</TabsList>
				<TabsContent value="tier">
					<TiersCard/>
				</TabsContent>
				<TabsContent value="class">
					<ClassesCard/>
				</TabsContent>
				<TabsContent value="attr">
					<AttributesCard/>
				</TabsContent>
			</Tabs>
		</div>
	)
}