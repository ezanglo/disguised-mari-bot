import { AttributesCard } from "@/components/admin/attributes-card";
import { ClassesCard } from "@/components/admin/classes-card";
import { SkillTypesCard } from "@/components/admin/skill-types-card";
import { TiersCard } from "@/components/admin/tiers-card";
import { UpgradeTypesCard } from "@/components/admin/upgrade-types-card";

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