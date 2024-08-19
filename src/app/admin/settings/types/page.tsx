import { AttributesCard } from "@/components/admin/settings/attributes-card";
import { ClassesCard } from "@/components/admin/settings/classes-card";
import { SkillTypesCard } from "@/components/admin/settings/skill-types-card";
import { TiersCard } from "@/components/admin/settings/tiers-card";
import { UpgradeTypesCard } from "@/components/admin/settings/upgrade-types-card";

export default function TypesPage() {
	return (
		<div className="grid gap-6">
			<TiersCard/>
			<ClassesCard/>
			<AttributesCard/>
			<UpgradeTypesCard/>
			<SkillTypesCard/>
		</div>
	)
}