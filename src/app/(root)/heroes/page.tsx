import { HeroList } from "@/components/admin/heroes/hero-list";
import { HeroListFilters } from "@/components/admin/heroes/hero-list-filters";
import { parseAsArrayOf } from "nuqs";
import { createSearchParamsCache, parseAsString } from "nuqs/server";

const searchParamsCache = createSearchParamsCache({
	tiers: parseAsArrayOf(parseAsString),
	classes: parseAsArrayOf(parseAsString),
	attributes: parseAsArrayOf(parseAsString),
})


type HeroesPageProps = {
	searchParams: Record<string, string | string[] | undefined>
}


export default async function HeroesPage({
	searchParams
}: HeroesPageProps) {

	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			<HeroListFilters className="justify-center"/>
			<HeroList
				className="justify-center"
				{...searchParamsCache.parse(searchParams)}
			/>
		</main>
	)
}