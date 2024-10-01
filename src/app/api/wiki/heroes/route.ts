import { getHeroes, Tier } from "@/lib/wiki-helper";

export async function GET() {

  try {

    const preProcessHero = (hero: any) => {
      let attribute = hero.attribute;
      switch(hero.attribute){
        case "Life":
          attribute = "life_green"
          break;
        case "Hellfire":
          attribute = "retribution_red"
          break;
        case "Judgement":
          attribute = "balance_blue"
          break;
        case "Cycles":
          attribute = "cycle_light"
          break;
        case "Destruction":
          attribute = "ruin_dark"
          break;
      }

      return {
        ...hero,
        attribute,
        tier: hero.tier === 'SS' ? 'SR': hero.tier
      }
    }


    const tiers = ['SS', 'S', 'A', 'T'];
    const processedHeroes = await Promise.all(
      tiers.map(async (tier) => {
        const heroes = await getHeroes(tier as Tier);
        return heroes.map(hero => preProcessHero(hero));
      })
    );

    const [SR, S, A, T] = processedHeroes;

    return Response.json({ SR, S, A, T });
  } catch (error) {
    const errorMessage = (error as Error).message;

    if (errorMessage === 'not-found') {
      return Response.json({ message: 'Not found' }, { status: 404 })
    }

    console.log(error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}