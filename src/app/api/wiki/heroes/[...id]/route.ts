import { getDetails, getGallery, getSkills, getSoulImprintSkills } from '@/lib/wiki-helper';

export const dynamic = 'force-static'

async function getHeroDetails(hero: string[], newHero: boolean = false) {
  try {
    const { title, details } = await getDetails(hero, newHero);
    const gallery = await getGallery(hero, newHero);
    let skills = await getSkills(hero, newHero);

    const icons = gallery['icons']
    let icon = gallery['icons']?.find((icon: any) => icon.type === 'Soul Imprint')?.image || '';
    if (!icon) {
      icon = icons?.reverse().find((icon: any) => icon.type.includes('icon'))?.image || '';
    }

    const displayName = title?.[0];
    let name = displayName?.split(" ")[0];
    const tier = details.find(i => i.label === 'Tier')
    if(tier && tier.value === 's'){
      name = displayName
    }

    const koreanName = title?.[1]

    return {
      name,
      displayName,
      koreanName,
      image: icon,
      icons,
      details,
      skills,
      gallery
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === 'new-hero') {
      return getHeroDetails(hero, true);
    }
    throw new Error(errorMessage);
  }
}

export async function GET(request: Request, { params }: { params: { id: string[] } }) {

  try {

    const hero = params.id;

    const heroDetails = await getHeroDetails(hero);

    return Response.json(heroDetails);
  } catch (error) {

    const errorMessage = (error as Error).message;

    if (errorMessage === 'not-found') {
      return Response.json({ message: 'Hero not found' }, { status: 404 })
    }

    console.error(error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}